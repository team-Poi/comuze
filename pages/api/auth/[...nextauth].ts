import NextAuth, { AuthOptions, Session } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/utils/prisma";
import { Adapter } from "next-auth/adapters";
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
      if (session.user) {
        const fetchSchool = async () => {
          let userSchool = await prisma.school.findFirst({
            where: {
              id: user.schoolId!,
            },
          });
          if (!userSchool) return undefined;
          return userSchool;
        };
        session.user.id = user.id;
        session.user.nickname = user.nickname ? user.nickname : undefined;
        session.user.age = user.age ? user.age : undefined;
        session.user.isAdmin = !!user.isAdmin;
        if (!user.schoolId) session.user.school = undefined;
        else session.user.school = await fetchSchool();
        session.user.classNumber = user.classNumber
          ? user.classNumber
          : undefined;
      }
      return session;
    }) as any,
  },
};

export default NextAuth(authOptions);
