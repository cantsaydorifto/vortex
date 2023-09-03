import authVerify from "@/util/authVerify";
import { z } from "zod";
import { NextResponse } from "next/server";
import prisma from "@/util/prisma";

function getCommunityInfoSchema() {
  return z.object({
    communityName: z
      .string({
        required_error: "Community name is required",
      })
      .min(3, "Community name should be atleast 3 characters long"),
    description: z.string({
      required_error: "Community description is required",
    }),
    image: z
      .string({ required_error: "Image file is required" })
      .min(1, "Image cant be empty"),
    icon: z
      .string({ required_error: "Icon file is required" })
      .min(1, "icon cant be empty"),
  });
}

export async function POST(request: Request) {
  try {
    const user = await authVerify();
    const reqBody = await request.json();
    const communityInfo = getCommunityInfoSchema().safeParse(reqBody);

    if (!communityInfo.success)
      throw { status: 400, message: communityInfo.error.issues[0].message };

    if (communityInfo.data.communityName.includes(" "))
      throw {
        status: 400,
        message: "spaces are not allowed for community names",
      };

    const res = await prisma.community.create({
      data: {
        icon: communityInfo.data.icon,
        img: communityInfo.data.image,
        name: communityInfo.data.communityName,
        description: communityInfo.data.description,
        creatorId: user.id,
      },
    });

    return NextResponse.json(
      { message: "community created", name: res.name },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || err || "ERROR" },
      { status: err.status || 400 }
    );
  }
}
