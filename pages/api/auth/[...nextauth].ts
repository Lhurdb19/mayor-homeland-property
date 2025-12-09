// pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth";
import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
  session: { strategy: "jwt" },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        await connectDB();

        const user = await User.findOne({ email: credentials?.email });

        if (!user) throw new Error("No user found with this email");

        const isValid = await bcrypt.compare(
          credentials!.password,
          user.password
        );

        if (!isValid) throw new Error("Invalid password");

        if (!user.isVerified) throw new Error("Please verify your email first");

        return {
          id: user._id.toString(),
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          name: `${user.firstName} ${user.lastName}`,
          isVerified: user.isVerified,
        };
      },
    }),
  ],

 callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.role = user.role;
        token.name = user.name;
        token.isVerified = user.isVerified;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.role = token.role as string;
        session.user.name = token.name as string;
        session.user.isVerified = token.isVerified as boolean;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
