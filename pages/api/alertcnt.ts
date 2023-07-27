// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import prisma from "@/utils/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session)
    return res.send({
      s: false,
      e: -1,
      v: 0,
    });
  let cnt = await prisma.alert.count({
    where: {
      userId: session.user.id,
    },
  });
  return res.send({
    s: true,
    v: cnt,
  });
}
