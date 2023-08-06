import prisma from "@/util/prisma";
import { cookies } from "next/headers";

export const authRefreshVerify = async () => {
  if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET)
    throw { status: 500, message: "JWT SECRET NOT FOUND" };

  const cookie = cookies().get("jwt");
  if (!cookie || !cookie.value) throw { status: 401, message: "Unauthorized" };
  const refreshToken = cookie.value;

  const userRefreshToken = await prisma.refreshToken.findUnique({
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
    throw { status: 401, message: "Unauthorized" };
  }
  return {
    username: userRefreshToken.User.username,
    id: userRefreshToken.User.id,
  };
};
