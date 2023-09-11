import authVerify from "@/util/authVerify";
import prisma from "@/util/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

function getCommentInfo() {
  return z.object({
    content: z.string({
      required_error: "Content is required",
    }),
    postId: z.number({ required_error: "Post ID is required" }),
  });
}

export async function POST(request: Request) {
  try {
    const user = await authVerify();
    const reqBody = await request.json();
    const commentInfo = getCommentInfo().safeParse(reqBody);
    if (!commentInfo.success)
      throw { status: 400, message: commentInfo.error.issues[0].message };

    const comment = await prisma.comment.create({
      data: {
        content: commentInfo.data.content,
        postId: commentInfo.data.postId,
        authorId: user.id,
      },
    });

    return NextResponse.json(
      { message: "Comment Added", comment },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || err || "ERROR" },
      { status: err.status || 400 }
    );
  }
}
