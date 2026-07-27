// src/lib/auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        // 1. Find the user in the database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) {
          throw new Error("No user found with this email");
        }

        // 2. Check the password
        // (We check both hashed passwords AND plain text just for your initial admin test)
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password).catch(() => false);
        const isPlainTextValid = credentials.password === user.password;

        if (!isPasswordValid && !isPlainTextValid) {
          throw new Error("Invalid password");
        }

        // 3. Return user data (This gets saved in the secure session cookie)
        return {
          id: user.id,
          email: user.email,
          role: user.role,
        };
      }
    })
  ],
  callbacks: {
    // Attach the user's Role to the session token
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    // Attach the Role to the frontend session
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login', // Redirect to our custom login page
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,
};