import prisma from "@/util/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await prisma.vortex_Community.update({
      data: {
        description:
          "Welcome to the ultimate football hub! Share goals, discuss matches, and connect with fans worldwide in our passionate community dedicated to the beautiful game ⚽",
      },
      where: {
        id: 1,
      },
    });
    await prisma.vortex_Community.update({
      data: {
        description:
          "Dive into the rhythm of our music paradise! From melodies that move you to artists who inspire, join our harmonious community to share, discuss, and groove with music enthusiasts worldwide 🎵",
      },
      where: {
        id: 2,
      },
    });
    await prisma.vortex_Community.update({
      data: {
        description:
          "Embark on a journey with us! Explore breathtaking destinations, share travel tips, and connect with fellow globetrotters in our vibrant community 🌍",
      },
      where: {
        id: 3,
      },
    });
    await prisma.vortex_Community.update({
      data: {
        description:
          "Indulge in the world of coffee with us! Discover new flavors, exchange brewing secrets, and connect over the shared love for all things caffeinated.",
      },
      where: {
        id: 4,
      },
    });
    return NextResponse.json({ message: "communites updated" });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || err || "ERROR" },
      { status: err.status || 400 }
    );
  }
}
