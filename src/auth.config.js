import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { fetchUserMailAndPass } from "./services/UsersServices";

export default {
  providers: [
    Google,
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        let user = null
        // logic to salt and hash password
        // const pwHash = saltAndHashPassword(credentials.password)
        const pwHash = credentials.password

        let body = {
          email: credentials.email,
          contrasena: pwHash
        }
        // logic to verify if user exists
        user = await fetchUserMailAndPass(body)
        console.log('USER', user);
        if (!user) {
          // No user found, so this is their first attempt to login
          // meaning this is also the place you could do registration
          throw new Error("User not found.")
        }

        // return user object with the their profile data
        return user
      },
    }),
  ],

}