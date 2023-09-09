import Sidebar from "@/components/sidebar/Sidebar";
import styles from "./communityPage.module.css";
import CommunityInfo from "./CommunityInfo";
import prisma from "@/util/prisma";
import PostCard from "@/components/PostCard/PostCard";
import { authRefreshVerify } from "@/util/authRefreshVerify";
import Link from "next/link";

async function getCommunityAndPosts(communityName: string) {
  let userId: number | null = null;
  try {
    const user = await authRefreshVerify();
    userId = user.id;
  } catch (err) {
    console.log(err);
  }
  try {
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
    });
    const posts = postRes.map((post) => ({
      ...post,
      Likes: post.Likes.length,
      DisLikes: post.DisLikes.length,
    }));

    if (!userId) {
      return { community, posts, userActions: null };
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
      userActions: {
        userLikes: userLikes.map((el) => el.postId),
        userDislikes: userDislikes.map((el) => el.postId),
      },
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
            <div>
              <img src={res.community.icon} alt={res.community.name} />
              <span>
                {res.community.name[0].toUpperCase() +
                  res.community.name.slice(1)}
              </span>
            </div>
            <Link href="/post/create">
              <img
                src="https://cdn-icons-png.flaticon.com/512/1828/1828575.png"
                alt=""
              />
              <span>Create Post</span>
            </Link>
          </div>
          {res.posts.map((post) =>
            !res.userActions ? (
              <PostCard
                like={false}
                dislike={false}
                key={post.id}
                post={post}
              />
            ) : (
              <PostCard
                like={res.userActions.userLikes.includes(post.id)}
                dislike={res.userActions.userDislikes.includes(post.id)}
                key={post.id}
                post={post}
              />
            )
          )}
        </div>
        <CommunityInfo res={res.community} />
      </div>
    </main>
  );
}
