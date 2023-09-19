import { authRefreshVerify } from "@/util/authRefreshVerify";
import styles from "./page.module.css";
import Community from "@/components/home-community/Community";
import Link from "next/link";
import PostCard from "@/components/PostCard/PostCard";
import CreateCommunity from "@/components/CreateButton/CreateCommunity";
import PopularCommunites from "@/components/popularCommunites/PopularCommunites";
import prisma from "@/util/prisma";

export default async function Home() {
  const res = await getNewestPosts();
  if (!res) return <h1>ERROR !!!!</h1>;
  return (
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
          {res.posts.map((el) =>
            !res.userInfo ? (
              <PostCard
                postPage={false}
                like={false}
                showPost={false}
                dislike={false}
                key={el.id}
                post={el}
              />
            ) : (
              <PostCard
                postPage={false}
                showPost={false}
                like={res.userInfo.userLikes.includes(el.id)}
                dislike={res.userInfo.userDislikes.includes(el.id)}
                key={el.id}
                post={el}
              />
            )
          )}
        </div>
        <PopularCommunites />
      </div>
    </div>
  );
}

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
        Comment: { select: { postId: true } },
      },
    });

    const posts = postRes.map((post) => ({
      ...post,
      Likes: post.Likes.length,
      DisLikes: post.DisLikes.length,
      Comment: post.Comment.length,
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
      userInfo: {
        userLikes: userLikes.map((el) => el.postId),
        userDislikes: userDislikes.map((el) => el.postId),
      },
    };
  } catch (err) {
    console.log(err);
  }
}
