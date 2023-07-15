import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/prisma";
import { useSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "./[...nextauth]";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  let session = await getServerSession(req, res, authOptions);

  if (!session) {
    // not signed in
    return res.send({
      s: false,
      e: -1,
    });
  }

  let nickname = req.body.nickname;
  let age = req.body.age;
  let Class = req.body.Class;
  if (nickname != session.user.nickname) {
    let nickData = await prisma.user.count({
      where: {
        nickname: nickname,
      },
    });
    if (nickData > 0)
      return res.send({
        s: false,
        e: -2,
      });
  }
  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      nickname: nickname,
      age: age,
        classNumber: Class,
    },
  });
  return res.send({
    s: true,
    e: null,
  });
}
