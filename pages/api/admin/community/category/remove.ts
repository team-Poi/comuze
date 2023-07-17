import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]";
import prisma from "@/utils/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    const id_ = req.body.id as string | null;
    if (typeof id_ != "string")
      return res.send({
        s: false,
        e: -1,
      });
    const id = parseInt(id_);

    const session = await getServerSession(req, res, authOptions);
    if (!session)
      return res.send({
        s: false,
        e: -2,
      });
    if (!session.user.isAdmin)
      return res.send({
        s: false,
        e: -3,
      });

    await prisma.category.delete({
      where: {
        id: id,
      },
    });

    return res.send({
      s: true,
    });
  } catch (e) {
    return res.send({
      s: false,
      e: -4,
    });
  }
}
