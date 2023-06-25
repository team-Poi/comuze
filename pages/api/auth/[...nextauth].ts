import NextAuth, { AuthOptions, Session } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/utils/prisma";
import { Adapter, AdapterUser } from "next-auth/adapters";
import Auth0Provider from "next-auth/providers/auth0";
import { User } from "@prisma/client";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID!,
      clientSecret: process.env.AUTH0_CLIENT_SECRET!,
      issuer: process.env.AUTH0_ISSUER,
    }),
  ],
  callbacks: {
    session: (async ({ session, user }: { session: Session; user: User }) => {
      console.log(user);
      if (session.user) {
        session.user.id = user.id;
        session.user.nickname = user.nickname ? user.nickname : undefined;
        session.user.age = user.age ? user.age : undefined;
        session.user.school = user.school ? user.school : undefined;
        session.user.classNumber = user.classNumber
          ? user.classNumber
          : undefined;
      }
      return session;
    }) as any,
  },
};

export default NextAuth(authOptions);
