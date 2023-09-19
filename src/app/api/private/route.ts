import authVerify from "@/util/authVerify";
import prisma from "@/util/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await authVerify();
    const res = await prisma.vortex_User.findMany({
      select: {
        username: true,
      },
    });
    const res2 = res.map((el) => el.username);
    return NextResponse.json({ users: res2 });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || err || "ERROR" },
      { status: err.status || 400 }
    );
  }
}
