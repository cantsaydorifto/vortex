import { NextResponse } from "next/server";
import prisma from "@/util/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const postId = Number(params.id);
  try {
    const [postRes, commentRes] = await prisma.$transaction([
      prisma.vortex_Post.findUnique({
        where: { id: postId },
        include: {
          author: {
            select: {
              username: true,
            },
          },
          Community: {
            select: {
              id: true,
              icon: true,
              name: true,
            },
          },
          Likes: { select: { userId: true } },
          DisLikes: { select: { userId: true } },
          Comment: { select: { postId: true } },
        },
      }),
      prisma.vortex_Comment.findMany({
        where: {
          postId,
        },
        include: {
          author: {
            select: {
              username: true,
            },
          },
          CommentLike: { select: { userId: true } },
          CommentDisLike: { select: { userId: true } },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

    if (!postRes) return null;

    const [post, comments] = [
      postRes
        ? {
            ...postRes,
            Likes: postRes.Likes.length,
            DisLikes: postRes.DisLikes.length,
            Comment: postRes.Comment.length,
          }
        : null,
      commentRes.map((el) => ({
        ...el,
        CommentLike: el.CommentLike.length,
        CommentDisLike: el.CommentDisLike.length,
      })),
    ];
    return NextResponse.json(
      {
        post,
        comments,
        postId,
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || err || "ERROR" },
      { status: err.status || 400 }
    );
  }
}
