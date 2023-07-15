import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      age?: number;
      isAdmin?: boolean;
      school?: {
        id: string;
        areaCode: string;
        office: string;
        schoolName: string;
        schoolEngName: string;
        schoolType: string;
        city: string;
        eduDiv: string;
        releaseType: string;
        address: string;
        phoneNumber: string;
        url: string;
        genderDiv: string;
      };
      nickname?: string;
      classNumber?: number;
    } & DefaultSession["user"];
  }
}
