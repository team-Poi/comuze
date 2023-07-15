import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./[...nextauth]";
import prisma from "@/utils/prisma";
import cacheSchools from "@/nies/cacheSchool";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    // get Body
    const phoneNum = req.body.phoneNumber as string | null;
    const schoolCode = req.body.schoolCode as string | null;
    const schoolName = req.body.schoolName as string | null;
    const nickname = req.body.nickname as string | null;
    const age = req.body.age as number | null;
    const classNum = req.body.classNum as number | null;

    if (!schoolCode || !age || !classNum || !nickname || !schoolName)
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

    await cacheSchools(schoolName);
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
