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
    const foundUser = await fetchUserByEmail(email)
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
    maxAge: 1 * 60 * 60, // 4 horas
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account", // Fuerza la selección de cuenta
          access_type: "offline",
        }
      },
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
          if (!user) {
            // Este string literal será enviado como `res.error`
            throw new Error("usuario-no-encontrado");
          }
          if (user?.validacion === false) {
            throw new Error("cuenta-no-validada");
          }
          return user; // éxito
        } catch (error) {
          console.error('ERROR en authorize:', error);
          throw new Error(error.message || "error-desconocido");
        }
      }
    }),
  ],
  pages: {
    signIn: "/",
    error: "/error",
  },
  callbacks: {

    async signIn({ account, profile, credentials }) {
      if (account.provider === "google") {
        const allowedDomains = ["@mail.udp.cl", "@gmail.com"];
        const isAllowedDomain = allowedDomains.some(domain =>
          profile.email.endsWith(domain)
        );

        if (
          profile.email_verified && isAllowedDomain) {
          try {
            const user = await searchUser(profile.email);

            // return !!user;
            if (user.validacion === false) {
              // No se encontró en tu base de datos
              return "/error?error=EmailSignin";
            }
            return true;

          } catch (error) {
            throw new Error(error.message || "Configuration");
          }
        } else {
          return "/error?error=DominioNoPermitido";
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
        token.id = profile.id;
        token.name = profile.nombre || user.name;
        token.rol = profile.tipo_usuario;
        token.email = profile.email;
        token.nombre_social = profile.tipo_usuario !== 'alumno' ? profile?.nombre : profile?.nombre_social || profile?.nombre;
      }
      
      if (token.email) {
        const profile = await searchUser(token.email);
        token.name = profile.nombre || token.name;
        token.rol = profile.tipo_usuario;
        token.email = profile.email;
        token.nombre_social = profile.tipo_usuario !== 'alumno' ? profile?.nombre : profile?.nombre_social || profile?.nombre;
      }

      return token;
    },

    async redirect({ url, baseUrl }) {
      // Si la URL es una ruta relativa, crea una URL absoluta
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      // Si la URL ya es absoluta pero está en el mismo origen
      else if (new URL(url).origin === baseUrl) {
        return url;
      }
      // Por defecto, redirige al baseUrl
      return baseUrl;
    },
    async session({ session, token }) {

      session.user = {
        id: token.id,
        name: token.name,
        rol: token.rol,
        email: token.email,
        nombre_social: token.nombre_social,
        picture: token.picture,
      };
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { authOptions };
export { handler as GET, handler as POST };
