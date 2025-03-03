import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./db";
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [GitHub, 
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
          params: {
              prompt: "consent",
              access_type: "offline",
              response_type: "code"
          }
      },
  })
],
cookies: {
  pkceCodeVerifier: {
      name: "next-auth.pkce.code_verifier",
      options: {
          httpOnly: true,
          sameSite: "none",
          path: "/",
          secure: true
        }
      }
    }
  }
);