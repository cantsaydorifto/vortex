import authVerify from "@/util/authVerify";
import { NextResponse } from "next/server";
import prisma from "@/util/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (isNaN(params.id as any)) {
      throw { status: 400, message: "Id Is A Number" };
    }
    const user = await authVerify();

    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: user.id,
          followingId: Number(params.id),
        },
      },
    });

    if (existingFollow) {
      await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId: user.id,
            followingId: Number(params.id),
          },
        },
      });
      return NextResponse.json({ message: "Unfollowed User" }, { status: 200 });
    }

    await prisma.follow.create({
      data: {
        followerId: user.id,
        followingId: Number(params.id),
      },
    });

    return NextResponse.json({ message: "Followed User" }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || err || "ERROR" },
      { status: err.status || 400 }
    );
  }
}
