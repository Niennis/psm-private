import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google"
import { fetchUsers, fetchUserByEmail } from "@/services/UsersServices";
import { redirect } from "next/dist/server/api-utils";
import bcrypt from "bcryptjs"
import { fetchUserMailAndPass } from "@/services/UsersServices";
import Credentials from "next-auth/providers/credentials"
import { fetchProfessionals } from "@/services/DoctorsServices";
import CacheHandler from "@/utils/cache-handler";

const searchUser = async (email) => {
  const cacheKey = `user-${email}`;
  const cachedUser = await cacheHandler.get(cacheKey);
  if (cachedUser) return cachedUser;

  try {
    const [users, professionals, administrador] = await Promise.all([
      fetchUsers(),
      fetchProfessionals(),
      fetchUserByEmail(email)
    ]);

    const user = users.users.find(user => user.email === email);
    const professional = professionals.find(prof => prof.email === email);

    const foundUser = user || professional || administrador;
    if (foundUser) {
      // await cacheHandler.set(cacheKey, foundUser, { tags: ['users'] });
      return foundUser;
    } else {
      console.error("No se encontró el usuario:", error);
      throw new Error("No se encontró el usuario");
    }
  } catch (error) {
    console.error("Error buscando usuario:", error);
    throw error;
  }
};

const cacheHandler = new CacheHandler();

const authOptions = {
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile(profile) {
        return ({
          id: profile.sub,
          name: profile.name,
          apellido: profile.family_name,
          email: profile.email,
          image: profile.picture
        })
      }
    }),
    Credentials({
      credentials: {
        email: { label: "email", type: "email", placeholder: 'example@example.com' },
        password: { label: "password", type: "password" }
      },
      /* AUTHORIZE */
      authorize: async (credentials) => {
        // const cacheKey = `user-${credentials.email}`;
        // const cachedUser = await cacheHandler.get(cacheKey);
        // if (cachedUser) return cachedUser;

        // let user = undefined;
        const pwHash = credentials.password

        let body = {
          email: credentials.email,
          contrasena: pwHash
        }

        console.log('body en credentials', body)
        try {
          const user = await fetchUserMailAndPass(body)
          if (!user) {
            throw new Error("usuario no encontrado.")
          }

          // if (user) {
          //   await cacheHandler.set(cacheKey, user, { tags: ['user'] });
          return user;
          // }
          // throw new Error("Usuario no encontrado.");

          // if (user.email === body.email && user.contrasena === body.contrasena) {
          //   return user
          // }
        } catch (error) {
          console.log('Ocurrió un problema: ', error)
          throw new Error(`ocurrió un problema: ${error}`)
        }
      },
      /* FIN AUTHORIZE */
    }),
  ],
  pages: {
    signIn: '/',
    error: '/error/page'
  },
  callbacks: {
    async signIn({ account, profile, credentials }) {
      if (account.provider === "google") {
        if (profile.email_verified && profile.email.endsWith("@gmail.com" || "@mail.udp.cl")) {
          const user = await searchUser(profile.email);
          if (user) {
            return true;
          } else {
            return false
          }
        } else {
          throw new Error("Correo no autorizado o usuario no encontrado.");
          return false
        }
      }

      if (account.provider === "credentials") {
        const body = { email: credentials.email, contrasena: credentials.password };
        const user = await fetchUserMailAndPass(body);
        console.log('user', user)
        if (user) {
          return true;
        } else {
          throw new Error("Credenciales incorrectas.");
          return false
        }
      }

      return false;
    },
    async jwt({ token, user }) {

      const profile = await searchUser(token.email)
      console.log('jwt - profile', profile)
      if (profile.validacion === false) {
        throw new Error("Usuario no encontrado.");
      } else {
        if (token) {
          token.id = profile.id
          token.name = token.name || profile.nombre;
          token.rol = profile.tipo_usuario;
          return token;
        }
      }
    },
    async session({ session, user, token }) {
      // const cacheKey = `session-${session.user.email}`;
      // const cachedSession = await cacheHandler.get(cacheKey);
      // if (cachedSession) return cachedSession;
      // console.log('cached', cachedSession)
      session.user = token;
      session.user.id = token.id;
      session.user.name = token.name
      session.user.rol = token.rol;
      // try {
      //   // Guardar en caché
      //   await cacheHandler.set(cacheKey, session, { tags: ['sessions'] });
      //   return session;
      // } catch (error) {
      //   console.error("Error al generar sesión:", error);
      // }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// export { handler as GET, handler as POST }
const handler = NextAuth(authOptions);
export { authOptions };
export { handler as GET, handler as POST }