import prismadb from "@/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { chatgpt } from "@/openai/gpt";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { postId, chatId } = req.body;
    if (!postId || !chatId)
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

    let post = await prismadb.post.findUnique({
      where: {
        id: parseInt(postId as string),
      },
      select: {
        authorId: true,
        onlyAuthorChat: true,
        content: true,
        author: {
          select: {
            age: true,
          },
        },
      },
    });
    if (!post)
      return res.send({
        s: false,
        e: -3,
      });

    if (post.authorId != session.user.id)
      return res.send({
        s: false,
        e: -4,
      });

    await prismadb.chat.update({
      where: {
        id: chatId as string,
      },
      data: {
        content: await chatgpt(post.content),
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
