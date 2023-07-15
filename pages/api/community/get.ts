// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "@/utils/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const id__ = req.query.id as string | null;
  if (!id__)
    return res.send({
      s: false,
      e: -1,
    });
  const id = parseInt(id__);
  if (id.toString() != id__)
    return res.send({
      s: false,
      e: -2,
    });
  const session = await getServerSession(req, res, authOptions);
  if (!session)
    return res.send({
      s: false,
      e: -3,
    });
  let x = await prisma.post.findFirst({
    where: {
      id: id,
    },
    select: {
      id: false,
      content: true,
      title: true,
      authorId: true,
      author: {
        select: {
          age: true,
        },
      },
      categoryID: true,
      category: {
        select: {
          name: true,
        },
      },
      onlyAuthorChat: true,
    },
  });
  if (!x)
    return res.send({
      s: false,
      e: -2,
    });
  if (x?.author.age == null || session.user.age == undefined) return;
  if (Math.abs(x?.author.age - session.user.age) >= 3)
    return res.send({
      s: false,
      e: -4,
    });
  return res.status(200).send({
    s: true,
    e: -5,
    data: x,
    isMine: x.authorId == session.user.id,
  });
}
