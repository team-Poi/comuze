import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "./[...nextauth]";
import { getServerSession } from "next-auth";
import prismadb from "@/utils/prisma";

export default async function DetailedInfo(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let session = await getServerSession(req, res, authOptions);

  if (!session)
    return res.send({
      s: false,
      e: -1,
    });

  let user = await prismadb.user.findFirst({
    where: {
      id: session.user.id,
    },
  });

  if (!user)
    return res.send({
      s: false,
      e: -2,
    });

  return res.send({
    s: true,
    e: {
      joinedAt: user.registeredAt.getTime(),
      postCount: await prismadb.post.count({
        where: {
          authorId: user.id,
        },
      }),
      likesCount: await prismadb.like.count({
        where: {
          post: {
            authorId: user.id,
          },
        },
      }),
    },
  });
}
