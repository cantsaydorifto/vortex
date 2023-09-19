import authVerify from "@/util/authVerify";
import { NextResponse } from "next/server";
import prisma from "@/util/prisma";

export async function GET(
  request: Request,
  { params }: { params: { name: string } }
) {
  const following: number[] = [];
  const communityName = params.name;
  try {
    const user = await authVerify();
    following.push(...user.following);
  } catch (err) {
    console.log(err);
  }
  try {
    const community = await prisma.vortex_Community.findUnique({
      where: {
        name: communityName,
      },
    });
    const postRes = await prisma.vortex_Post.findMany({
      where: {
        communityId: community?.id,
      },
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
        community,
        posts,
        following,
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
