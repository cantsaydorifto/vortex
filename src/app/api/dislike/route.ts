import authVerify from "@/util/authVerify";
import { z } from "zod";
import { NextResponse } from "next/server";
import prisma from "@/util/prisma";

function getPostInfoSchema() {
  return z.object({
    id: z.number({
      required_error: "Post Id is required",
    }),
  });
}

export async function PUT(request: Request) {
  try {
    const user = await authVerify();
    const reqBody = await request.json();
    const postInfo = getPostInfoSchema().safeParse(reqBody);

    if (!postInfo.success)
      throw { status: 400, message: postInfo.error.issues[0].message };

    const [existingLike, existingDislike] = await prisma.$transaction([
      prisma.vortex_Likes.findUnique({
        where: {
          userId_postId: {
            postId: postInfo.data.id,
            userId: user.id,
          },
        },
      }),
      prisma.vortex_DisLikes.findUnique({
        where: {
          userId_postId: {
            postId: postInfo.data.id,
            userId: user.id,
          },
        },
      }),
    ]);

    if (existingDislike) {
      await prisma.vortex_DisLikes.delete({
        where: {
          userId_postId: {
            postId: postInfo.data.id,
            userId: user.id,
          },
        },
      });
      return NextResponse.json(
        { message: "Removed Dislike From Post" },
        { status: 200 }
      );
    }

    if (!existingLike) {
      await prisma.vortex_DisLikes.create({
        data: {
          postId: postInfo.data.id,
          userId: user.id,
        },
      });
      return NextResponse.json(
        { message: "Disliked the Post" },
        { status: 200 }
      );
    }

    await prisma.$transaction([
      prisma.vortex_Likes.delete({
        where: {
          userId_postId: {
            postId: postInfo.data.id,
            userId: user.id,
          },
        },
      }),
      prisma.vortex_DisLikes.create({
        data: {
          postId: postInfo.data.id,
          userId: user.id,
        },
      }),
    ]);

    return NextResponse.json({ message: "Disliked the Post" }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || err || "ERROR" },
      { status: err.status || 400 }
    );
  }
}
