import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import prisma from "@/util/prisma";

export async function GET() {
  const cookie = cookies().get("jwt");
  try {
    if (!cookie || !cookie.value)
      throw { status: 401, message: "Unauthorized" };
    const refreshToken = cookie.value as string;
    const userRefreshToken = await prisma.refreshToken.findUnique({
      where: {
        token: refreshToken,
      },
      include: {
        User: {
          select: {
            username: true,
            email: true,
            id: true,
          },
        },
      },
    });
    if (!userRefreshToken) throw { status: 403, message: "Forbidden" };

    if (!process.env.JWT_REFRESH_SECRET)
      throw { status: 400, message: "JWT SECRET NOT FOUND" };
    if (!process.env.JWT_SECRET)
      throw { status: 400, message: "JWT SECRET NOT FOUND" };

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err) => {
      if (err) throw { status: 403, message: err.message, refreshExp: true };
    });
    const accessToken = jwt.sign(
      { ...userRefreshToken.User },
      process.env.JWT_SECRET,
      { expiresIn: "5s" }
    );
    return NextResponse.json(
      {
        username: userRefreshToken.User.username,
        email: userRefreshToken.User.email,
        token: accessToken,
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || err || "ERROR", refreshExp: err.refreshExp },
      { status: err.status || 400 }
    );
  }
}
