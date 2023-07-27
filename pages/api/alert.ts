// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import prisma from "@/utils/prisma";
import { sendAlert } from "@/utils/alert";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session)
    return res.send({
      s: false,
      e: -1,
    });
  if (req.method === "GET") {
    let alerts = await prisma.alert.findMany({
      where: {
        userId: session.user.id,
      },
    });
    return res.send({
      s: true,
      data: alerts,
    });
  } else if (req.method === "DELETE") {
    let id = req.query.id;
    if (!id)
      return res.send({
        s: false,
        e: -2,
      });
    let alert = await prisma.alert.findFirst({
      where: {
        id: id as string,
      },
    });
    if (!alert)
      return res.send({
        s: false,
        e: -3,
      });
    if (alert.userId != session.user.id)
      return res.send({
        s: false,
        e: -4,
      });
    await prisma.alert.delete({
      where: {
        id: alert.id,
      },
    });
    return res.send({
      s: true,
    });
  } else if (req.method === "POST") {
    let id = req.body.id;
    let content = req.body.content;
    let title = req.body.title;

    if (!id)
      return res.send({
        s: false,
        e: -2,
      });

    if (!session.user.isAdmin)
      return res.send({
        s: false,
        e: -3,
      });
    await sendAlert({
      userId: id,
      type: 0,
      data: {
        title: title,
        content: content,
      },
    });
    return res.send({
      s: true,
    });
  } else {
    return res.send({
      s: false,
    });
  }
}
