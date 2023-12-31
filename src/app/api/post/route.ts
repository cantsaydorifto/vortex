import authVerify from "@/util/authVerify";
import prisma from "@/util/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

function getPostInfo() {
  return z.object({
    title: z
      .string({
        required_error: "Post title is required",
      })
      .min(1, "Title cant be empty"),
    content: z.string({
      required_error: "Content is required",
    }),
    communityId: z.number({ required_error: "Select a community" }),
  });
}

export async function POST(request: Request) {
  try {
    const reqBody = await request.json();
    const user = await authVerify();
    const postInfo = getPostInfo().safeParse(reqBody);
    if (!postInfo.success)
      throw { status: 400, message: postInfo.error.issues[0].message };

    const post = await prisma.vortex_Post.create({
      data: {
        content: postInfo.data.content,
        title: postInfo.data.title,
        authorId: user.id,
        communityId: postInfo.data.communityId,
      },
    });

    return NextResponse.json(
      { message: "Post created", post },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || err || "ERROR" },
      {
        status: err.status || 400,
      }
    );
  }
}

export async function GET() {
  try {
    const communities = await prisma.vortex_Community.findMany({
      take: 20,
    });
    const postRes = await prisma.vortex_Post.findMany({
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
      orderBy: {
        createdAt: "desc",
      },
    });
    const posts = postRes.map((post) => ({
      ...post,
      Likes: post.Likes.length,
      DisLikes: post.DisLikes.length,
      Comment: post.Comment.length,
    }));
    return NextResponse.json(
      {
        communities,
        posts,
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
