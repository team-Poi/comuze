import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./[...nextauth]";
import prisma from "@/utils/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    // get Body
    const phoneNum = req.body.phoneNumber as string | null;
    const schoolCode = req.body.schoolCode as string | null;
    const nickname = req.body.nickname as string | null;
    const age = req.body.age as number | null;
    const classNum = req.body.classNum as number | null;

    if (!phoneNum || !schoolCode || !age || !classNum || !nickname)
      return res.send({
        s: false,
        e: "Body invalid",
      });

    const session = await getServerSession(req, res, authOptions);
    if (!session)
      return res.send({
        s: false,
        e: "Not authenticated",
      });

    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        schoolId: schoolCode,
        classNumber: classNum,
        phoneNum: phoneNum,
        nickname: nickname,
        age: age,
      },
    });
    return res.send({
      s: true,
      e: null,
    });
  } catch (err) {
    return res.send({
      s: false,
      e: err,
    });
  }
}
