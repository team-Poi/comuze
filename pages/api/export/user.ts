// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "@/utils/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session)
    return res.send({
      s: false,
    });
  let user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      qpoint: true,
      email: true,
      emailVerified: true,
      registeredAt: true,
      image: true,
      isAdmin: true,
      phoneNum: true,
      accounts: true,
      schoolId: true,
      age: true,
      classNumber: true,
      name: true,
      nickname: true,
      posts: true,
      sessions: true,
      myLikes: true,
      chats: true,
    },
  });
  if (!user)
    return res.send({
      s: false,
    });

  return res.send({
    s: true,
    data: user,
  });
}
