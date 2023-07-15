// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import prisma from "@/utils/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const title = req.query.title as string | null;
  const page = req.query.page as string | null;
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.redirect("/");
  if (!session.user.isAdmin) return res.redirect("/");
  if (!page || parseInt(page) < 1)
    return res.send({
      s: false,
    });
  let x = await prisma.user.findMany({
    skip: (parseInt(page) - 1) * 30,
    take: 30,
    where: {
      ...(title
        ? {
            nickname: {
              contains: title,
            },
          }
        : {}),
    },
  });
  return res.send({
    s: true,
    data: x,
  });
}
