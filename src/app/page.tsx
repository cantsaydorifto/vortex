import PostCard from "@/components/PostCard/PostCard";
import styles from "./page.module.css";
import Community from "@/components/home-community/Community";
import PopularCommunites from "@/components/popularCommunites/PopularCommunites";
import Sidebar from "@/components/sidebar/Sidebar";
import prisma from "@/util/prisma";
import { authRefreshVerify } from "@/util/authRefreshVerify";
import CreateCommunity from "@/components/CreateButton/CreateCommunity";
import Link from "next/link";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getNewestPosts() {
  let userId: number | null = null;
  //   const following: number[] = [];
  try {
    await wait(3000);
    const user = await authRefreshVerify();
    userId = user.id;
  } catch (err) {
    console.log(err);
  }
  try {
    const postRes = await prisma.vortex_Post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            username: true,
          },
        },
        Community: {
          select: {
            id: true,
            icon: true,
            name: true,
          },
        },
        Likes: { select: { userId: true } },
        DisLikes: { select: { userId: true } },
      },
    });

    const posts = postRes.map((post) => ({
      ...post,
      Likes: post.Likes.length,
      DisLikes: post.DisLikes.length,
    }));

    if (!userId) {
      return { posts };
    }

    const [userLikes, userDislikes] = await prisma.$transaction([
      prisma.vortex_Likes.findMany({
        where: {
          userId,
        },
        select: {
          postId: true,
        },
      }),
      prisma.vortex_DisLikes.findMany({
        where: {
          userId,
        },
        select: {
          postId: true,
        },
      }),
    ]);
    return {
      posts,
      userLikes: userLikes.map((el) => el.postId),
      userDislikes: userDislikes.map((el) => el.postId),
    };
  } catch (err) {
    console.log(err);
  }
}

export default async function Home() {
  const res = await getNewestPosts();
  if (!res) return <h1>ERROR !!!!</h1>;
  return (
    <main className={styles.main}>
      <Sidebar />
      <div className={styles.content}>
        <Community />
        <div>
          <div>
            <div>
              <Link href="/post/create" className={styles.createPostLink}>
                <img
                  src="https://cdn-icons-png.flaticon.com/512/848/848006.png"
                  alt="User"
                />
                <input type="text" placeholder="Create Post" />
              </Link>
              <CreateCommunity />
            </div>
            {res.posts.map((el) => (
              <PostCard
                post={el}
                key={el.id}
                postPage={false}
                showPost={true}
              />
            ))}
          </div>
          <PopularCommunites />
        </div>
      </div>
    </main>
  );
}
