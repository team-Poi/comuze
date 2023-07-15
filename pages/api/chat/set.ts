import prismadb from "@/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { kensorship } from "@/openai/kensorship";
import { authOptions } from "../auth/[...nextauth]";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { content, postId } = req.body;
    if (!content || !postId)
      return res.send({
        s: false,
        e: -1,
        msg: "Something went wrong",
      });
    const session = await getServerSession(req, res, authOptions);
    if (!session)
      return res.send({
        s: false,
        e: -2,
      });
    if ((await kensorship(content as string)).startsWith("Y"))
      return res.send({
        s: false,
        e: -3,
      });
    await prismadb.chat.create({
      data: {
        postID: parseInt(postId as string),
        authorId: session.user.id,
        content: content as string,
      },
    });
    return res.send({
      s: true,
    });
  } catch (e) {
    return res.send({
      s: false,
      e: -1,
      msg: e,
    });
  }
}
