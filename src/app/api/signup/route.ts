import { cookies } from "next/headers";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import prisma from "@/util/prisma";

function getUserInfoSchema() {
  return z.object({
    username: z
      .string({ required_error: "Username is required" })
      .min(6, "Username should be atleast 6 characters long"),
    email: z
      .string({ required_error: "Email is required" })
      .email("Not a valid email"),
    password: z
      .string({ required_error: "Password is required" })
      .min(8, "Short Password - Password should be atleast 8 characters long"),
  });
}

export async function POST(request: Request) {
  try {
    const reqBody = await request.json();

    if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET)
      throw { status: 500, message: "JWT SECRET NOT FOUND" };

    const userInfo = getUserInfoSchema().safeParse(reqBody);

    if (!userInfo.success)
      throw { status: 400, message: userInfo.error.issues[0].message };

    const userUsername = await prisma.user.findUnique({
      where: {
        username: userInfo.data.username,
      },
    });
    const userEmail = await prisma.user.findUnique({
      where: {
        email: userInfo.data.email,
      },
    });

    if (userUsername) throw { status: 401, message: "username already in use" };
    if (userEmail) throw { status: 401, message: "email already in use" };

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(userInfo.data.password, salt);

    const refreshToken = jwt.sign(
      { username: userInfo.data.username },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "4d" }
    );

    const user = await prisma.user.create({
      data: {
        email: userInfo.data.email,
        password: hash,
        username: userInfo.data.username,
        RefreshToken: {
          create: {
            token: refreshToken,
          },
        },
      },
    });

    const accessToken = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "5min" }
    );

    cookies().set("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return NextResponse.json({ token: accessToken }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || err || "ERROR" },
      {
        status: err.status || 400,
      }
    );
  }
}
