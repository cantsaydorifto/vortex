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

    const existingFollow = await prisma.followingCommunity.findUnique({
      where: {
        userId_communityId: {
          communityId: Number(params.id),
          userId: user.id,
        },
      },
    });

    if (existingFollow) {
      await prisma.followingCommunity.delete({
        where: {
          userId_communityId: {
            communityId: Number(params.id),
            userId: user.id,
          },
        },
      });
      return NextResponse.json({ message: "Left Community" }, { status: 200 });
    }

    await prisma.followingCommunity.create({
      data: {
        communityId: Number(params.id),
        userId: user.id,
      },
    });

    return NextResponse.json({ message: "Joined Communtiy" }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || err || "ERROR" },
      { status: err.status || 400 }
    );
  }
}
