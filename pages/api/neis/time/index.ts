import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import fetchTime from "@/nies/fetchTime";
import age2grade from "@/utils/age2grade";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  let session = await getServerSession(req, res, authOptions);
  if (!session)
    return res.send({
      s: false,
      e: -1,
    });

  if (!session.user.school || !session.user.classNumber || !session.user.age)
    return res.send({
      s: false,
      e: -2,
    });
  try {
    let x = fetchTime(
      session.user.school.id,
      session.user.school.areaCode,
      age2grade(session.user.age),
      session.user.classNumber,
      session.user.school.schoolType as any
    );
    return res.send({
      s: true,
      e: await x,
    });
  } catch (e) {
    return res.send({
      s: false,
      e: -3,
      msg: e,
    });
  }
}
