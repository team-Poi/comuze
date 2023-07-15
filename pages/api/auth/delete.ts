import { NextApiRequest, NextApiResponse } from "next";
import { authOptions } from "./[...nextauth]";
import { getServerSession } from "next-auth";
import prismadb from "@/utils/prisma";

export default async function DetailedInfo(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    let session = await getServerSession(req, res, authOptions);

    if (!session)
      return res.send({
        s: false,
        e: -1,
      });
    let x = await prismadb.user.findFirst({
      where: {
        id: session.user.id,
      },
    });
    if (!x)
      return res.send({
        s: false,
        e: "User not found",
      });
    let data = await prismadb.user.delete({
      where: {
        id: session.user.id,
      },
    });

    return res.send({
      s: true,
      id: data.id,
    });
  } catch (e) {
    return res.send({
      s: false,
      e: e,
    });
  }
}
