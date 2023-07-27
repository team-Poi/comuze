// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { kensorship } from "@/openai/kensorship";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "@/utils/prisma";
import { htmlToText } from "html-to-text";
import { chatgpt } from "@/openai/gpt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    const title = req.body.title as string | null;
    const content = req.body.content as string | null;
    const category = req.body.category as number | null;
    const onlyAuthorView = req.body.oav as boolean | null;
    const gpt = req.body.gpt as boolean | null;
    const gptOnly = req.body.noUserChat as boolean | null;

    if (
      !title ||
      !content ||
      !category ||
      typeof onlyAuthorView != "boolean" ||
      typeof gpt != "boolean" ||
      typeof gptOnly != "boolean"
    )
      return res.send({
        s: false,
        e: -1,
      });
    const session = await getServerSession(req, res, authOptions);
    if (!session)
      return res.send({
        s: false,
        e: -2,
      });
    if ((await kensorship(title)).startsWith("Y"))
      return res.send({ s: false, e: -3 });
    if ((await kensorship(htmlToText(content))).startsWith("Y"))
      return res.send({ s: false, e: -4 });
    let x = await prisma.post.create({
      data: {
        title: title,
        content: content,
        authorId: session.user.id.toString(),
        categoryID: category,
        onlyAuthorChat: onlyAuthorView,
        isGPTOnly: gptOnly,
      },
    });

    res.status(200).send({
      s: true,
      id: x.id,
    });

    if (gpt)
      await prisma.chat.create({
        data: {
          postID: x.id,
          authorId: "chatgpt",
          content: await chatgpt(x.content),
          isGptRecall: true,
        },
      });

    return;
  } catch (e) {
    return res.status(200).send({
      s: false,
      e: e,
    });
  }
}
