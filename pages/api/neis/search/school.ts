import fetchSchool from "@/nies/fetchSchool";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  res.send({
    data: await fetchSchool(
      req.query.schoolName as string,
      req.query.count as string | undefined
    ),
  });
}
