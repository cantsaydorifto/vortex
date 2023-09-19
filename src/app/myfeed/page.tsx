import Sidebar from "@/components/sidebar/Sidebar";
import styles from "./myfeed.module.css";
import prisma from "@/util/prisma";
import { authRefreshVerify } from "@/util/authRefreshVerify";
import PostCard from "@/components/PostCard/PostCard";
import type { vortex_Post as Post } from "@prisma/client";

async function getUserPageInfo() {
  let userId: number | null = null;
  //   const following: number[] = [];
  try {
    const user = await authRefreshVerify();
    userId = user.id;
    // following.push(...user.following);
  } catch (err) {
    console.log(err);
  }
  try {
    if (!userId) {
      return null;
    }

    const posts = await getPostsForFeed(userId);

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

export default async function Page() {
  const res = await getUserPageInfo();
  if (!res || !res.posts)
    return (
      <main className={styles.container}>
        <Sidebar />
        <div className={styles.pageContainer}>
          <h1>Cant Find User</h1>
        </div>
      </main>
    );
  return (
    <main className={styles.container}>
      <Sidebar />
      <div className={styles.pageContainer}>
        <h1 className={styles.h1}>Your Feed</h1>
        <p>Posts from users and communities you follow</p>
        <div className={styles.postContainer}>
          {res.posts.map((el) => (
            <PostCard
              post={el}
              postPage={false}
              key={el.id}
              showPost={true}
              like={res.userLikes.includes(el.id)}
              dislike={res.userDislikes.includes(el.id)}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

async function getPostsForFeed(userId: number) {
  const user = await prisma.vortex_User.findUnique({
    where: {
      id: userId,
    },
    include: {
      FollowingCommunity: {
        include: {
          Community: {
            select: {
              Post: {
                include: {
                  author: {
                    select: {
                      username: true,
                    },
                  },
                  Community: {
                    select: {
                      id: true,
                      name: true,
                      icon: true,
                    },
                  },
                  Likes: { select: { userId: true } },
                  DisLikes: { select: { userId: true } },
                  Comment: { select: { postId: true } },
                },
                orderBy: {
                  createdAt: "desc",
                },
              },
            },
          },
        },
      },
      Follower: {
        include: {
          Following: {
            select: {
              Post: {
                include: {
                  author: {
                    select: {
                      username: true,
                    },
                  },
                  Community: {
                    select: {
                      id: true,
                      name: true,
                      icon: true,
                    },
                  },
                  Likes: { select: { userId: true } },
                  DisLikes: { select: { userId: true } },
                  Comment: { select: { postId: true } },
                },
                orderBy: {
                  createdAt: "desc",
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user) return null;

  const postsFromFollowingCommunities: ActualPost[] = [];
  const postsFromFollowingUsers: ActualPost[] = [];

  user.FollowingCommunity.forEach((el) => {
    el.Community.Post.forEach((post) => {
      postsFromFollowingCommunities.push({
        ...post,
        Comment: post.Comment.length,
        Likes: post.Likes.length,
        DisLikes: post.DisLikes.length,
      });
    });
  });

  user.Follower.forEach((follower) => {
    follower.Following.Post.forEach((post) => {
      postsFromFollowingUsers.push({
        ...post,
        Comment: post.Comment.length,
        Likes: post.Likes.length,
        DisLikes: post.DisLikes.length,
      });
    });
  });

  const allPosts = [
    ...postsFromFollowingCommunities,
    ...postsFromFollowingUsers,
  ];

  const uniquePosts = Array.from(new Set(allPosts.map((post) => post.id)))
    .map((postId) => allPosts.find((post) => post.id === postId))
    .filter((post) => post !== undefined) as ActualPost[];

  const sortedPosts = uniquePosts.sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );

  return sortedPosts;
}

type ActualPost = Post & {
  Likes: number;
  DisLikes: number;
  Comment: number;
  Community: {
    id: number;
    name: string;
    icon: string;
  };
  author: { username: string };
};
