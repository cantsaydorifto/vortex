import prisma from "@/util/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const cookie = cookies().get("jwt");
    if (!cookie || !cookie.value)
      throw { status: 401, message: "Unauthorized" };

    const refreshToken = cookie.value;

    const userRefreshToken = await prisma.refreshToken.findUnique({
      where: {
        token: refreshToken,
      },
      include: {
        User: {
          select: {
            username: true,
          },
        },
      },
    });

    if (!userRefreshToken) {
      cookies().set({
        name: "jwt",
        value: "",
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      cookies().delete("jwt");
      return NextResponse.json({ message: "Deleted Cookies" }, { status: 200 });
    }

    cookies().set({
      name: "jwt",
      value: "",
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    cookies().delete("jwt");

    await prisma.refreshToken.delete({
      where: {
        token: refreshToken,
      },
    });

    return NextResponse.json({ message: "Logout Successful" }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || err || "ERROR" },
      { status: err.status || 400 }
    );
  }
}
