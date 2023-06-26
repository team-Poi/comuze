import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/utils/prisma";
import { kensorship } from "@/openai/kensorship";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const nickname = req.body.nickname as string | null;
  if (!nickname)
    return res.send({
      s: false,
      e: "Body invalid",
    });
  let x = await prisma.user.count({
    where: {
      nickname: nickname,
    },
  });
  if (x > 0) return res.send({ s: false, e: 1 });
  let dt = await kensorship(nickname);
  if (dt.startsWith("Y")) return res.send({ s: false, e: 2 });
  return res.send({ s: true });
}
