import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google"
import { fetchUsers } from "@/services/UsersServices";
import { redirect } from "next/dist/server/api-utils";
import bcrypt from "bcryptjs"
import { fetchUserMailAndPass } from "@/services/UsersServices";
import Credentials from "next-auth/providers/credentials"
import { fetchProfessionals } from "@/services/DoctorsServices";

const searchUser = async email => {
  const response = await fetchUsers()
  const user = response.users.filter(user => user.email === email)

  const professionals = await fetchProfessionals()
  const prof = professionals.filter(user => user.email === email)
  if (prof.length === 1) return prof
  if (user.length === 1) return user
}

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
          user = await fetchUserMailAndPass(body)// user = {
          if (!user) {
            // No user found, so this is their first attempt to login
            // meaning this is also the place you could do registration
            throw new Error({message: "usuario no encontrado."})
          }
          if (user.email === body.email && user.contrasena === body.contrasena) {
            return user
          }
        } catch (error) {
          console.log('Ocurrió un problema: ', error)
          throw new Error({message: `ocurrió un problema: ${error}`})
        }
      },
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
        console.log('ENTRÓ A GOOGLE')
        if (profile.email_verified && profile.email.endsWith("@gmail.com" || "@mail.udp.cl")) {
          profile.rol === 'alumno'
          return true
        } else {
          throw new Error({ message: 'dominio incorrecto' })
        }
      }

      if (account.provider === "google") {
        console.log('ENTRÓ A GOOGLE')
        const response = await fetchUsers()
        const userDB = response.users.filter(user => user[0].email === email)

        if (userDB.length >= 1) {
          profile.rol === 'alumno'
          return true
        } else {
          throw new Error({ message: 'no se encontró al usuario' })
        }
      }

      // Si el proveedor es credentials, validar que exista en la DB
      if (account.provider === "credentials") {
        console.log('ENTRÓ A CREDENTIALS')
        try {
          const body = {
            email: credentials.email,
            contrasena: credentials.password
          }
          const user = await fetchUserMailAndPass(body)

          if (user.length === 0) {
            // Si length === 0 , no encontró al usuario, no puede acceder
            // redirect(`/api/auth/error?error=noseencontroalusuario`)
            throw new Error({ message: 'no se encontró al usuario' });
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
      try {
        const users = await searchUser(session.user.email)
        if (token /* && token.user */) {
          if (session.user.email === users[0].email) {
            session.user = token
            session.user.name = !session.user.name && users[0].nombre + ' ' + users[0].apellido
            session.user.rol = users[0].tipo_usuario
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
})

export { handler as GET, handler as POST }