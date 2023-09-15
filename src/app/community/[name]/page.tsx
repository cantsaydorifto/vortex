import Sidebar from "@/components/sidebar/Sidebar";
import styles from "./communityPage.module.css";
import CommunityInfo from "./CommunityInfo";
import prisma from "@/util/prisma";
import PostCard from "@/components/PostCard/PostCard";
import { authRefreshVerify } from "@/util/authRefreshVerify";
import CommunityDescription from "./CommunityDescription";
import Link from "next/link";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getCommunityAndPosts(communityName: string) {
  let userId: number | null = null;
  const following: number[] = [];
  try {
    const user = await authRefreshVerify();
    userId = user.id;
    following.push(...user.following);
  } catch (err) {
    console.log(err);
  }
  try {
    // await wait(10000);
    // console.log("done");
    const community = await prisma.community.findUnique({
      where: {
        name: communityName,
      },
    });
    const postRes = await prisma.post.findMany({
      where: {
        communityId: community?.id,
      },
      include: {
        author: {
          select: {
            username: true,
          },
        },
        Likes: { select: { userId: true } },
        DisLikes: { select: { userId: true } },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    const posts = postRes.map((post) => ({
      ...post,
      Likes: post.Likes.length,
      DisLikes: post.DisLikes.length,
    }));

    if (!userId) {
      return { community, posts, userInfo: null, following };
    }
    const [userLikes, userDislikes] = await prisma.$transaction([
      prisma.likes.findMany({
        where: {
          userId,
          Post: {
            communityId: community?.id,
          },
        },
        select: {
          postId: true,
        },
      }),
      prisma.disLikes.findMany({
        where: {
          userId,
          Post: {
            communityId: community?.id,
          },
        },
        select: {
          postId: true,
        },
      }),
    ]);
    console.log(userLikes);
    return {
      community,
      posts,
      userInfo: {
        userLikes: userLikes.map((el) => el.postId),
        userDislikes: userDislikes.map((el) => el.postId),
      },
      following,
    };
  } catch (err) {
    console.log(err);
  }
}

export default async function Page({ params }: { params: { name: string } }) {
  const res = await getCommunityAndPosts(params.name);
  if (!res || !res.community || !res.posts) return; //RETURN SOME ERROR
  return (
    <main className={styles.container}>
      <Sidebar />
      <div className={styles.comInfoContainer}>
        <div className={styles.postContainer}>
          <div>
            <CommunityDescription
              community={res.community}
              following={res.following}
            />
            <Link href="/post/create">
              <img
                src="https://cdn-icons-png.flaticon.com/512/1828/1828575.png"
                alt=""
              />
              <span>Create Post</span>
            </Link>
          </div>
          {res.posts.map((post) =>
            !res.userInfo ? (
              <PostCard
                postPage={false}
                like={false}
                dislike={false}
                key={post.id}
                post={post}
              />
            ) : (
              <PostCard
                postPage={false}
                like={res.userInfo.userLikes.includes(post.id)}
                dislike={res.userInfo.userDislikes.includes(post.id)}
                key={post.id}
                post={post}
              />
            )
          )}
        </div>
        <CommunityInfo
          following={res.following.includes(res.community.id)}
          res={res.community}
        />
      </div>
    </main>
  );
}
