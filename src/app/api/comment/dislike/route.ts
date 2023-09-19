import authVerify from "@/util/authVerify";
import { z } from "zod";
import { NextResponse } from "next/server";
import prisma from "@/util/prisma";

function getCommentInfoSchema() {
  return z.object({
    id: z.number({
      required_error: "Comment Id is required",
    }),
  });
}

export async function PUT(request: Request) {
  try {
    const user = await authVerify();
    const reqBody = await request.json();
    const postInfo = getCommentInfoSchema().safeParse(reqBody);

    if (!postInfo.success)
      throw { status: 400, message: postInfo.error.issues[0].message };

    const [existingLike, existingDislike] = await prisma.$transaction([
      prisma.vortex_CommentLike.findUnique({
        where: {
          userId_commentId: {
            commentId: postInfo.data.id,
            userId: user.id,
          },
        },
      }),
      prisma.vortex_CommentDisLike.findUnique({
        where: {
          userId_commentId: {
            commentId: postInfo.data.id,
            userId: user.id,
          },
        },
      }),
    ]);

    if (existingDislike) {
      await prisma.vortex_CommentDisLike.delete({
        where: {
          userId_commentId: {
            commentId: postInfo.data.id,
            userId: user.id,
          },
        },
      });
      return NextResponse.json(
        { message: "Removed Dislike From Comment" },
        { status: 200 }
      );
    }

    if (!existingLike) {
      await prisma.vortex_CommentDisLike.create({
        data: {
          commentId: postInfo.data.id,
          userId: user.id,
        },
      });
      return NextResponse.json(
        { message: "Disliked the Comment" },
        { status: 200 }
      );
    }

    await prisma.$transaction([
      prisma.vortex_CommentLike.delete({
        where: {
          userId_commentId: {
            commentId: postInfo.data.id,
            userId: user.id,
          },
        },
      }),
      prisma.vortex_CommentDisLike.create({
        data: {
          commentId: postInfo.data.id,
          userId: user.id,
        },
      }),
    ]);

    return NextResponse.json(
      { message: "Disliked the Comment" },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || err || "ERROR" },
      { status: err.status || 400 }
    );
  }
}
