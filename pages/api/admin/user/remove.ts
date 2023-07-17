// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import prisma from "@/utils/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const id = req.body.id as string | null;
  if (!id) return res.redirect("/admin/user/search");

  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.redirect("/");
  if (!session.user.isAdmin) return res.redirect("/");

  await prisma.user.delete({
    where: {
      id: id as string,
    },
  });

  return res.send({
    s: true,
  });
}
