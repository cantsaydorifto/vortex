import prisma from "@/util/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await prisma.vortex_Community.create({
      data: {
        creatorId: 1,
        name: "football",
        icon: "https://cdn-icons-png.flaticon.com/512/1099/1099794.png",
        img: "https://img.olympicchannel.com/images/image/private/t_s_w1340/t_s_16_9_g_auto/f_auto/primary/ngdjbafv3twathukjbq2",
        description:
          "Welcome to the ultimate football hub! Share goals, discuss matches, and connect with fans worldwide in our passionate community dedicated to the beautiful game ⚽",
      },
    });
    await prisma.vortex_Community.create({
      data: {
        creatorId: 1,
        name: "music",
        icon: "https://cdn-icons-png.flaticon.com/512/3659/3659784.png",
        img: "https://geekflare.com/wp-content/uploads/2022/05/what-is-music-production-1500x999.jpeg",
        description:
          "Dive into the rhythm of our music paradise! From melodies that move you to artists who inspire, join our harmonious community to share, discuss, and groove with music enthusiasts worldwide 🎵",
      },
    });
    await prisma.vortex_Community.create({
      data: {
        creatorId: 3,
        name: "travel",
        icon: "https://cdn-icons-png.flaticon.com/512/826/826070.png",
        img: "https://assets-global.website-files.com/6268ee704c062ad6dcc39250/629f1dae21e30a08b00d6cd4_travel-photography-hashtag.jpeg",
        description:
          "Embark on a journey with us! Explore breathtaking destinations, share travel tips, and connect with fellow globetrotters in our vibrant community 🌍",
      },
    });
    await prisma.vortex_Community.create({
      data: {
        creatorId: 2,
        name: "coffee",
        icon: "https://cdn-icons-png.flaticon.com/512/2935/2935307.png",
        img: "https://www.shutterstock.com/shutterstock/photos/2270067755/display_1500/stock-photo--d-wallpaper-vintage-hand-drawn-coffee-shop-background-wall-decors-2270067755.jpg",
        description:
          "Indulge in the world of coffee with us! Discover new flavors, exchange brewing secrets, and connect over the shared love for all things caffeinated",
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
