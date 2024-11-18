import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google"
import { fetchUsers } from "@/services/UsersServices";
import { redirect } from "next/dist/server/api-utils";
import bcrypt from "bcryptjs"
import { fetchUserMailAndPass } from "@/services/UsersServices";
import Credentials from "next-auth/providers/credentials"
import { fetchProfessionals } from "@/services/DoctorsServices";
import CacheHandler from "@/utils/cache-handler";

const searchUser = async email => {
  let response;
  let professionals;
  try {
    response = await fetchUsers()
    professionals = await fetchProfessionals()
  } catch (error) {
    throw new Error('No se encontró al usuario')
  }
  const user = response.users.filter(user => user.email === email)
  const prof = professionals.filter(user => user.email === email)
  if (prof.length === 1) return prof
  if (user.length === 1) return user
}

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
      // Si el proveedor es google, validar que sea correo udp.

      if (account.provider === "google") {
        if (profile.email_verified && profile.email.endsWith("@gmail.com" || "@mail.udp.cl")) {
          profile.rol === 'alumno'
          return true
        } else {
          throw new Error('dominio incorrecto')
        }
      }

      if (account.provider === "google") {
        const response = await fetchUsers()
        const userDB = response.users.filter(user => user[0].email === email)

        if (userDB.length >= 1) {
          profile.rol === 'alumno'
          return true
        } else {
          throw new Error('no se encontró al usuario')
        }
      }

      // Si el proveedor es credentials, validar que exista en la DB
      if (account.provider === "credentials") {
        try {
          const body = {
            email: credentials.email,
            contrasena: credentials.password
          }
          const user = await fetchUserMailAndPass(body)

          if (user.length === 0) {
            // Si length === 0 , no encontró al usuario, no puede acceder
            // redirect(`/api/auth/error?error=noseencontroalusuario`)
            throw new Error('no se encontró al usuario')
          }
          // Si lo anterior no ocurre, encontró el mail
          return true

        } catch (error) {
          console.log('ERRRRRRRRR', error);
          return false
        }
        // return
      }
    },
    async jwt({ token, user }) {

      const profile = await searchUser(token.email)
      if (token) {
        token.id = profile[0].id
        token.name = token ? token.name : `${token.nombre} ${token.apellido}`;
        token.rol = profile[0].tipo_usuario;
        if (typeof window !== 'undefined' && token) {
          localStorage.setItem('authToken', JSON.stringify(token));
        }
        return token;
      }
    },
    async session({ session, user, token }) {
      // const cacheKey = `session-${session.user.email}`;
      // const cachedSession = await cacheHandler.get(cacheKey);

      // if (cachedSession) {
      //   return cachedSession;
      // }

      // TODO buscar entre todos los usuarios para retornar el rol y agregarlo
      try {
        const users = await searchUser(session.user.email)
        if (token /* && token.user */) {
          if (session.user.email === users[0].email) {
            session.user = token;
            session.user.id = users[0].id;
            session.user.name = session.user.tipo_usuario === 'alumno' ? session.user.name : users[0].nombre;
            session.user.rol = token.rol;
            return session;
          }
          return session;
        }
        return session;
      } catch (error) {
        console.log('Hubo un error: ', error)
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// export { handler as GET, handler as POST }
const handler = NextAuth(authOptions);
export { authOptions };
export { handler as GET, handler as POST }