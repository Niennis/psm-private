export const sessionStatus = false;
/*
import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"

import { db } from "./db.js"
import authConfig from "./auth.config.js"
// import { getUserById } from "@/data/user"

export const {
  handlers,
  signIn,
  signOut,
  auth
} = NextAuth({
  callbacks: {
    async session({ token, session }) {
      console.log({ sessionToken: token })

      if (token.sub && session.user) {
        session.user.id = token.sub
      }

      if (token.roles && session.user) {
        session.user.roles = token.roles
      }
      // if (session.user) {
      //   session.user.customField = token.customField;
      // }
      return session
    },
    async jwt({ token }) {
      // console.log({ token });
      // token.customField = "test"
      if (!token.sub) return token
      // const existingUser = await getUserById(token.sub)
      const existingUser =  {
        name: 'test',
        email: 'test@example.com',
        picture: null,
        sub: 'clvn799ao0000gzh8yi399uvx',
        iat: 1714531178,
        exp: 1717123178,
        jti: '2fc8db31-2545-4cfa-9b40-9a263e8e107b',
        roles: 'USER'
      }

      if (!existingUser) return token;

      token.roles = existingUser.roles

      return token
    }
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
}) */

import NextAuth from "next-auth";
import authConfig from "@/auth.config";


export const {
  handlers, signIn, signOut, auth }
  = NextAuth({
    // adapter: PrismaAdapter(db),
    // session: { strategy: "jwt" },
    ...authConfig,
  })