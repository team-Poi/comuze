import prismadb from "@/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { postId } = req.query;
    if (!postId)
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
    let count = await prismadb.like.count({
      where: {
        postID: parseInt(postId as string),
      },
    });
    let post = await prismadb.like.findFirst({
      where: {
        postID: parseInt(postId as string),
        authorID: session.user.id,
      },
    });
    if (!post) {
      return res.send({
        s: true,
        e: null,
        like: false,
        count: count,
      });
    } else {
      return res.send({
        s: true,
        e: null,
        like: true,
        count: count,
      });
    }
  } catch (e) {
    return res.send({
      s: false,
      e: -1,
      msg: e,
    });
  }
}
