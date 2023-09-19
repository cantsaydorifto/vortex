import prisma from "@/util/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const authRefreshVerify = async () => {
  if (!process.env.JWT_REFRESH_SECRET)
    throw { status: 500, message: "JWT SECRET NOT FOUND" };

  const cookie = cookies().get("jwt");
  if (!cookie || !cookie.value) throw { status: 401, message: "Unauthorized" };
  const refreshToken = cookie.value;

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err) => {
    if (err) throw { status: 403, message: "Invalid Token" };
  });

  const userRefreshToken = await prisma.vortex_RefreshToken.findUnique({
    where: {
      token: refreshToken,
    },
    include: {
      User: {
        select: {
          username: true,
          id: true,
          FollowingCommunity: {
            select: {
              communityId: true,
            },
          },
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
    following: userRefreshToken.User.FollowingCommunity.map(
      (el) => el.communityId
    ),
  };
};
