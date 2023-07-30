import prismadb from "@/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { kensorship } from "@/openai/kensorship";
import { authOptions } from "../auth/[...nextauth]";
import { chatgpt } from "@/openai/gpt";
import { deleteAlert, sendAlert } from "@/utils/alert";
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

    let post = await prismadb.post.findFirst({
      where: {
        id: parseInt(postId as string),
      },
      select: {
        authorId: true,
        onlyAuthorChat: true,
        isGPTOnly: true,
        content: true,
        title: true,
        id: true,
        author: {
          select: {
            age: true,
          },
        },
      },
    });

    if (!post || !post.author.age || !session.user.age)
      return res.send({
        s: false,
        e: -1,
      });

    if (!post.isGPTOnly) {
      if (Math.abs(post.author.age - session.user.age) >= 3)
        return res.send({
          s: false,
          e: -3,
        });

      if ((await kensorship(content as string)).startsWith("Y"))
        return res.send({
          s: false,
          e: -4,
        });
    }

    if (post.authorId != session.user.id)
      return res.send({
        s: false,
        e: -5,
      });

    await prismadb.chat.create({
      data: {
        postID: parseInt(postId as string),
        authorId: session.user.id,
        content: content as string,
      },
    });

    if (post.authorId != session.user.id)
      try {
        await deleteAlert({
          alertId: `_${post.authorId}_${post.id}`,
        });
        await sendAlert({
          type: 1,
          data: {
            postId: post.id,
            title: post.title,
            count: await prismadb.chat.count(),
          },
          userId: post.authorId,
          alertId: `_${post.authorId}_${post.id}`,
        });
      } catch (e) {}

    if (post.isGPTOnly)
      await prismadb.chat.create({
        data: {
          content: await chatgpt(`글 내용
\`\`\`
${post.content}
\`\`\`

댓글 내용
\`\`\`
${content}
\`\`\`
글 내용을 참고해서 댓글에 '해요'로 끝나는 문장으로 답변해줘!`),
          authorId: "chatgpt",
          postID: parseInt(postId),
        },
      });

    return res.send({
      s: true,
    });
  } catch (e) {
    console.log(e);
    return res.send({
      s: false,
      e: -1,
      msg: e,
    });
  }
}
