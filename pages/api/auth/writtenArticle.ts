import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./[...nextauth]";
import prismadb from "@/utils/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    let session = await getServerSession(req, res, authOptions);

    if (!session)
      return res.send({
        s: false,
        e: -1,
      });
    let data = await prismadb.post.findMany({
      where: {
        authorId: session.user.id,
      },
    });

    return res.send(data);
  } catch (e) {
    return res.send({
      s: false,
      e: -2,
    });
  }
}
