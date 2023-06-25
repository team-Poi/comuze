import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      age?: number;
      isAdmin?: boolean;
      school?: BigInt;
    } & DefaultSession["user"];
  }
}
