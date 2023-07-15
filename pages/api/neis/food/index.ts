import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import urlQ from "@/utils/urlQ";
import axios from "axios";
import fetchFood from "@/nies/fetchFood";

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

  if (!session.user.school)
    return res.send({
      s: false,
      e: -2,
    });
  try {
    return res.send({
      s: true,
      e: await fetchFood({
        학교코드: session.user.school.id,
        교육청코드: session.user.school.areaCode,
        itemIndex: parseInt((req.query.page as string) || "1"),
      }),
    });
  } catch (e) {
    return res.send({
      s: false,
      e: -3,
      msg: e,
    });
  }
}
