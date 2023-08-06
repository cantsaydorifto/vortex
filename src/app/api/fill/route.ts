import prisma from "@/util/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await prisma.community.update({
      where: {
        id: 2,
      },
      data: {
        img: "https://geekflare.com/wp-content/uploads/2022/05/what-is-music-production-1500x999.jpeg",
      },
    });
    return NextResponse.json({ message: "communites created" });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || err || "ERROR" },
      { status: err.status || 400 }
    );
  }
}
