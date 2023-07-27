import prismadb from "@/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { postId } = req.body;
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
    let like = await prismadb.like.findFirst({
      where: {
        postID: parseInt(postId),
        authorID: session.user.id,
      },
    });
    if (!like) {
      await prismadb.like.create({
        data: {
          authorID: session.user.id,
          postID: parseInt(postId),
        },
      });
      return res.send({
        s: true,
        e: null,
        like: true,
      });
    } else {
      await prismadb.like.delete({
        where: {
          id: like.id,
        },
      });
      return res.send({
        s: true,
        e: null,
        like: false,
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
