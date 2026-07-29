// src/lib/auth.ts
import { prisma } from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log(" Login attempt for:", credentials?.email);

        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Missing email or password");
          return null;
        }
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) {
          console.log(" User not found in database");
          return null;
        }

        console.log("✅ User found. Comparing password...");
        const isValid = await bcrypt.compare(credentials.password, user.password);
        
        if (!isValid) {
          console.log("❌ Password is invalid");
          return null;
        }

        console.log("🎉 Login successful for:", user.email);
        return {
          id: user.id,
          email: user.email,
          role: user.role,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};