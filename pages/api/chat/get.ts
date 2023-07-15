import prismadb from "@/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import foods from "@/names/dict/foods";
import prefix from "@/names/dict/prefix";
import { authOptions } from "../auth/[...nextauth]";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { postId } = req.query;
    if (!postId)
      return res.send({
        s: false,
        e: -1,
        data: [],
        msg: "Something went wrong",
      });

    const session = await getServerSession(req, res, authOptions);

    if (!session)
      return res.send({
        s: false,
        data: [],
        e: -2,
      });
    let post = await prismadb.post.findUnique({
      where: {
        id: parseInt(postId as string),
      },
      select: {
        authorId: true,
        onlyAuthorChat: true,
        author: {
          select: {
            age: true,
          },
        },
      },
    });
    if (!post || !post.author || !post.author.age || !session.user.age)
      return res.send({
        s: false,
        data: [],
        e: -3,
      });
    if (Math.abs(post.author.age - session.user.age) >= 3)
      return res.send({
        s: false,
        data: [],
        e: -4,
      });
    let chats;
    if (post.onlyAuthorChat && post.authorId != session.user.id) {
      chats = await prismadb.chat.findMany({
        where: {
          postID: parseInt(postId as string),
          authorId: session.user.id,
        },
      });
    } else {
      chats = await prismadb.chat.findMany({
        where: {
          postID: parseInt(postId as string),
        },
      });
    }
    if (!chats)
      return res.send({
        s: false,
        e: -1,
      });
    let cache: { [key: string]: string } = {};
    cache["chatgpt"] = "Chatgpt";
    if (post.authorId != session.user.id) {
      cache[post.authorId] = "글 작성자";
      cache[session.user.id] = "나";
    }
    let hummanCnt = 1;
    return res.send({
      s: true,
      data: chats.map((chat) => {
        let userID = chat.authorId;
        let userName = "";
        if (cache[userID]) userName = cache[userID];
        else {
          userName = `${
            prefix[parseInt((hummanCnt / foods.length).toString())]
          } ${foods[hummanCnt % foods.length]}`;
          cache[userID] = userName;
          hummanCnt++;
        }
        return {
          id: chat.id,
          isMine: chat.authorId == session.user.id,
          content: chat.content,
          authorName: userName,
        };
      }),
      isMine: post.authorId == session.user.id,
    });
  } catch (e) {
    return res.send({
      s: false,
      e: -1,
      data: [],
      msg: e,
    });
  }
}
