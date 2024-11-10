import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google"
import { fetchUsers } from "@/services/UsersServices";
import { redirect } from "next/dist/server/api-utils";
import bcrypt from "bcryptjs"
import { fetchUserMailAndPass } from "@/services/UsersServices";
import Credentials from "next-auth/providers/credentials"

const searchUser = async email => {
  const response = await fetchUsers()
  const user = response.users.filter(user => user.email === email)
  return user
}
// admin, alumno, profesional
const ROL = 'admin'

const handler = NextAuth({
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile(profile) {
        return ({
          id: profile.sub,
          name: `${profile.name}`,
          apellido: `${profile.family_name}`,
          email: profile.email,
          image: profile.picture
        })
      }
    }),
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // name: 'Credentials',
      credentials: {
        email: { label: "email", type: "email", placeholder: 'example@example.com' },
        password: { label: "password", type: "password" }
      },
      authorize: async (credentials) => {
        let user = undefined;
        // logic to salt and hash password
        // const pwHash = saltAndHashPassword(credentials.password)
        const pwHash = credentials.password

        let body = {
          email: credentials.email,
          contrasena: pwHash
        }

        try {
          // user = await fetchUserMailAndPass(body)// user = {
          // }
          user = {
            email: 'juanperez@gmail.com',
            contrasena: '12345678'
          }
          if (!user) {
            // No user found, so this is their first attempt to login
            // meaning this is also the place you could do registration
            throw new Error("Usuario no encontrado.")
          } 
          if( user.email === body.email && user.contrasena === body.contrasena){
            return true
          }
        } catch (error) {
          console.log('Ocurrió un problema: ', error)
        }
      },
    }),
  ],
  pages: {
    signIn: 'https://sitioprivado-b2beb6cmh0b7cuf7.eastus-01.azurewebsites.net',
  },
  callbacks: {
    async signIn({ account, profile, credentials }) {
      // Si el proveedor es google, validar que sea correo udp.
      // TODO validar que solo sean usuarios de la DB
      if (account.provider === "google") {
        console.log('ENTRÓ A GOOGLE')
        if (profile.email_verified && profile.email.endsWith("@gmail.com")) {
          profile.rol === 'alumno'
          // return true
        }
        // return true
      }

      // Si el proveedor es credentials, validar que exista en la DB
      if (account.provider === "credentials") {
        console.log('ENTRÓ A CREDENTIALS')
        try {
          const body = { email: credentials.email, contrasena: credentials.password }
          const user = await fetchUserMailAndPass(body)
          console.log('USER', user);

          if (user.length === 0) {
            // Si length === 0 , no encontró al usuario, no puede acceder
            throw new Error('No se pudo acceder. Correo no autorizado.');
          }
          // Si lo anterior no ocurre, encontró el mail
          return true

        } catch (error) {
          console.log('ERRRRRRRRR', error);
        }
        // return
      }
    },
    async session({ session, user, token }) {
      // TODO buscar entre todos los usuarios para retornar el rol y agregarlo
      // const userS = await searchUser(profile.email)
      console.log('TOKEN', session, token)
      if (token /* && token.user */) {
        session.user = token; // Asegúrate de que `token.user` contenga las propiedades extendidas
        session.user.rol = ROL;
        console.log('SESSION', session);
        return session;

      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }