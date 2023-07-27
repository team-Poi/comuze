// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "@/utils/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    let postID = req.body.postID;
    let content = req.body.content;
    if (!postID)
      return res.send({
        s: false,
        e: -1,
      });

    const session = await getServerSession(req, res, authOptions);
    if (!session || typeof session.user.id != "string")
      return res.send({
        s: false,
        e: -2,
      });

    await prisma.postReport.create({
      data: {
        content: content as string,
        postID: parseInt(postID as string),
        reporterId: session.user.id,
      },
    });

    return res.send({
      s: true,
    });
  } catch (e) {
    console.log(e);
    return res.send({
      s: false,
    });
  }
}
