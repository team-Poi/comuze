// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    let data = await prisma.category.findMany({
      where: {
        show: true,
      },
      select: {
        id: true,
        posts: false,
        name: true,
        show: true,
      },
    });
    return res.status(200).send({
      s: true,
      data: data,
    });
  } catch (e) {
    return res.status(500).send({
      s: false,
      e: e,
    });
  }
}
