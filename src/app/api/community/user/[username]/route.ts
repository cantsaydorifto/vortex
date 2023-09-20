import { NextResponse } from "next/server";
import prisma from "@/util/prisma";

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  const username = params.username;
  try {
    const userPageData = await prisma.vortex_User.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
        username: true,
        createdAt: true,
        FollowingCommunity: {
          select: {
            Community: {
              select: {
                id: true,
                name: true,
                icon: true,
                description: true,
              },
            },
          },
        },
        Following: {
          select: {
            followerId: true,
          },
        },
      },
    });
    if (!userPageData) {
      throw { status: 400, message: "Cant find User" };
    }
    return NextResponse.json(
      {
        userInfo: {
          username: userPageData.username,
          joiningDate: userPageData.createdAt,
          userId: userPageData.id,
          following: userPageData.FollowingCommunity.length,
          followers: userPageData.Following.length,
          userProfilePic:
            "https://cdn-icons-png.flaticon.com/512/848/848006.png", //REPLACE THIS WITH THE DB ProfilePIC
        },
        followingCommunities: userPageData.FollowingCommunity,
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
