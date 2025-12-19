import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
    isVerified: boolean;
    lastLogin?: string;
  }

  interface Session {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      role: string;
      isVerified: boolean;
      lastLogin?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
    isVerified: boolean;
    lastLogin?: string;
  }
}
