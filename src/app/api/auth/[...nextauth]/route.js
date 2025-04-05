import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { fetchUser, fetchUsers, fetchUserByEmail, fetchUserMailAndPass } from "@/services/UsersServices";
import { fetchProfessionals } from "@/services/DoctorsServices";
import CacheHandler from "@/utils/cache-handler";

const cacheHandler = new CacheHandler();

const searchUser = async (email) => {
  const cacheKey = `user-${email}`;
  const cachedUser = await cacheHandler.get(cacheKey);
  if (cachedUser) return cachedUser;

  try {
    const [users, professionals, administrador] = await Promise.all([
      fetchUsers(),
      fetchProfessionals(),
      fetchUserByEmail(email),
    ]);

    const user = users.users.find((user) => user.email === email);
    const professional = professionals.find((prof) => prof.email === email);
    const foundUser = user || professional || administrador;

    if (foundUser) {
      // await cacheHandler.set(cacheKey, foundUser, { tags: ['users'] });
      return foundUser;
    } else {
      console.error("No se encontró el usuario:", email);
      throw new Error("No se encontró el usuario");
    }
  } catch (error) {
    console.error("Error buscando usuario:", error);
    throw error;
  }
};

const authOptions = {
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 4 * 60 * 60, // 4 horas
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          apellido: profile.family_name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
    Credentials({
      credentials: {
        email: { label: "email", type: "email", placeholder: "example@example.com" },
        password: { label: "password", type: "password" },
      },
      authorize: async (credentials) => {
        const body = {
          email: credentials.email,
          contrasena: credentials.password,
        };

        try {
          const user = await fetchUserMailAndPass(body);
          if (!user) throw new Error("Usuario no encontrado.");
          return user;
        } catch (error) {
          throw new Error(`Ocurrió un problema: ${error}`);
        }
      },
    }),
  ],
  pages: {
    signIn: "/",
    error: "/error/page",
  },
  callbacks: {
    async signIn({ account, profile, credentials }) {
      if (account.provider === "google") {
        if (
          profile.email_verified &&
          (profile.email.endsWith("@mail.udp.cl") || profile.email.endsWith("@gmail.com"))
        ) {
          const user = await searchUser(profile.email);
          return !!user;
        } else {
          throw new Error("Correo no autorizado o usuario no encontrado.");
        }
      }

      if (account.provider === "credentials") {
        const body = { email: credentials.email, contrasena: credentials.password };
        const user = await fetchUserMailAndPass(body);
        return !!user;
      }

      return false;
    },

    async jwt({ token, user }) {
      if (user) {
        const profile = await searchUser(user.email);
        if (profile?.validacion === false) {
          throw new Error("Usuario no encontrado.");
        }

        token.id = profile.id;
        token.name = profile.nombre || user.name;
        token.rol = profile.tipo_usuario;
        token.email = profile.email;
      }

      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.id,
        name: token.name,
        rol: token.rol,
        email: token.email,
      };
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { authOptions };
export { handler as GET, handler as POST };
