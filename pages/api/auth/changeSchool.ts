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
    const schoolCode = req.body.schoolCode as string | null;
    const schoolName = req.body.schoolName as string | null;

    if (!schoolCode || !schoolName)
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
