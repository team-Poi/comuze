// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "@/utils/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const title = req.query.title as string | null;
  const page = req.query.page as string | null;
  const searchCategory = req.query.category as string | null;
  const session = await getServerSession(req, res, authOptions);
  const showDifferentAge__ = req.query.showDifferentAge as string | null;
  const showDifferentAge = false;
  // showDifferentAge__ == null
  //   ? true
  //   : showDifferentAge__ === "1"
  //   ? true
  //   : false;

  if (!page || parseInt(page) < 1 || !searchCategory)
    return res.send({
      s: false,
      e: "Body invalid",
    });
  if (!session)
    return res.send({
      s: false,
      e: "Not authenticated",
    });
  let x = await prisma.post.findMany({
    skip: (parseInt(page) - 1) * 30,
    take: 30,
    where: {
      ...(title
        ? {
            title: {
              contains: title,
            },
          }
        : {}),
      author: {
        ...(showDifferentAge && session.user.age
          ? {}
          : {
              age: {
                lte: session.user.age! + 1,
                gte: session.user.age! - 1,
              },
            }),
      },
      category: {
        show: {
          equals: true,
        },
      },
      categoryID: {
        ...(searchCategory == "0"
          ? {}
          : { equals: parseInt(searchCategory as string) }),
      },
    },
    select: {
      author: {
        select: {
          age: true,
        },
      },
      title: true,
      id: true,
      authorId: false,
      content: false,
    },
  });
  return res.send({
    s: true,
    data: x,
  });
}
