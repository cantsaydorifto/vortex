import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/util/prisma";

export async function GET(request: NextRequest) {
  try {
    const reqBody = await request.nextUrl;
    const query = reqBody.searchParams.get("query");
    if (!query || typeof query !== "string") {
      throw { message: "Query Error" };
    }

    const res = await prisma.community.findMany({
      where: {
        name: {
          contains: query.toLowerCase().trim(),
        },
      },
      select: {
        icon: true,
        name: true,
        id: true,
      },
    });

    return NextResponse.json({ results: res }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || err || "ERROR" },
      { status: err.status || 400 }
    );
  }
}
