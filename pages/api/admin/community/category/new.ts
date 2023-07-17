import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]";
import prisma from "@/utils/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    const title = req.body.title as string | null;
    if (!title) return res.redirect("/");

    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.redirect("/");
    if (!session.user.isAdmin) return res.redirect("/");

    await prisma.category.create({
      data: {
        name: title,
      },
    });

    return res.send({
      s: true,
    });
  } catch (e) {
    return res.send({
      s: false,
      e: -1,
    });
  }
}
