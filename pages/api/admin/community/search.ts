// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import prisma from "@/utils/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const title = req.query.title as string | null;
  const searchCategory = req.query.category as string | null;
  const session = await getServerSession(req, res, authOptions);

  if (!searchCategory)
    return res.send({
      s: false,
      e: "Body invalid",
    });
  if (!session)
    return res.send({
      s: false,
      e: "Not authenticated",
    });

  if (!session.user.isAdmin)
    return res.send({
      s: false,
      e: "User is not admin",
    });

  let x = await prisma.post.findMany({
    where: {
      ...(title
        ? {
            title: {
              contains: title,
            },
          }
        : {}),
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
          nickname: true,
        },
      },
      title: true,
      id: true,
      authorId: true,
      content: true,
    },
  });

  return res.send({
    s: true,
    data: x,
  });
}
