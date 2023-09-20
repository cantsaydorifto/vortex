import { headers } from "next/headers";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import prisma from "./prisma";

export default async function authVerify() {
  if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET)
    throw { status: 500, message: "JWT SECRET NOT FOUND" };

  const cookie = cookies().get("jwt");
  if (!cookie || !cookie.value) throw { status: 401, message: "Unauthorized" };

  const refreshToken = cookie.value;

  const userRefreshToken = await prisma.vortex_RefreshToken.findUnique({
    where: {
      token: refreshToken,
    },
    include: {
      User: {
        select: {
          username: true,
          id: true,
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
    throw { status: 401, message: "Unauthorized" };
  }

  const authHeader = headers().get("authorization");

  if (!authHeader) throw { status: 401, message: "Unauthorized" };

  const token = authHeader.split(" ")[1];

  let decodedUsername: string | null = null;

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) throw { status: 403, message: "Invalid Token" };
    if (decoded && typeof decoded != "string" && decoded.username) {
      decodedUsername = decoded.username;
    }
  });

  if (userRefreshToken.User.username !== decodedUsername)
    throw { status: 401, message: "Unauthorized" };
  return {
    username: userRefreshToken.User.username,
    id: userRefreshToken.User.id,
  };
}
