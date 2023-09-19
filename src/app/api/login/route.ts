import { cookies } from "next/headers";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import prisma from "@/util/prisma";

function getUserInfoSchema() {
  return z.object({
    username: z
      .string({
        required_error: "Username is required",
      })
      .min(6, "Username should be atleast 6 characters long"),
    password: z
      .string({
        required_error: "Password is required",
      })
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
    console.log(userInfo.data);

    const user = await prisma.vortex_User.findUnique({
      where: {
        username: userInfo.data.username,
      },
      select: {
        username: true,
        email: true,
        password: true,
        id: true,
        Likes: {
          select: {
            postId: true,
          },
        },
        DisLikes: {
          select: {
            postId: true,
          },
        },
        CommentLike: {
          select: {
            commentId: true,
          },
        },
        CommentDisLike: {
          select: {
            commentId: true,
          },
        },
      },
    });
    if (!user) throw { status: 401, message: "User Does Not Exist" };

    const compare = await bcrypt.compare(userInfo.data.password, user.password);
    if (!compare)
      if (!compare) throw { status: 401, message: "Incorrect Password" };

    const accessToken = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "15min" }
    );

    const refreshToken = jwt.sign(
      {
        username: user.username,
      },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "4d" }
    );

    await prisma.vortex_RefreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
      },
    });
    cookies().set("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    return NextResponse.json(
      {
        username: user.username,
        email: user.email,
        token: accessToken,
        userPostLikes: user.Likes.map((el) => el.postId),
        userPostDislikes: user.DisLikes.map((el) => el.postId),
        userCommentLikes: user.CommentLike.map((el) => el.commentId),
        userCommentDislikes: user.CommentDisLike.map((el) => el.commentId),
      },
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
