import Sidebar from "@/components/sidebar/Sidebar";
import styles from "./userPage.module.css";
import UserInfoContainer from "./UserInfoContainer";
import prisma from "@/util/prisma";
import { authRefreshVerify } from "@/util/authRefreshVerify";
import PostCard from "@/components/PostCard/PostCard";

async function getUserPageInfo(username: string) {
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
    const userPageData = await prisma.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
        username: true,
        createdAt: true,
        FollowingCommunity: {
          select: {
            Community: {
              select: {
                id: true,
                name: true,
                icon: true,
              },
            },
          },
        },
      },
    });
    if (!userPageData) {
      return null;
    }

    const [followers, postRes] = await prisma.$transaction([
      prisma.follow.count({
        where: {
          followingId: userPageData.id,
        },
      }),
      prisma.post.findMany({
        where: {
          authorId: userPageData.id,
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
              name: true,
              icon: true,
            },
          },
          Likes: { select: { userId: true } },
          DisLikes: { select: { userId: true } },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

    const posts = postRes.map((post) => ({
      ...post,
      Likes: post.Likes.length,
      DisLikes: post.DisLikes.length,
    }));

    if (!userId) {
      return {
        posts,
        userInfo: {
          username: userPageData.username,
          joiningDate: userPageData.createdAt,
          userId: userPageData.id,
          following: userPageData.FollowingCommunity.length,
          followers,
          userProfilePic:
            "https://cdn-icons-png.flaticon.com/512/848/848006.png", //REPLACE THIS WITH THE DB ProfilePIC
        },
        following,
        follow: false,
      };
    }
    const [userLikes, userDislikes, follow] = await prisma.$transaction([
      prisma.likes.findMany({
        where: {
          userId,
          Post: {
            authorId: userPageData.id,
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
            authorId: userPageData.id,
          },
        },
        select: {
          postId: true,
        },
      }),
      prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: userPageData.id,
          },
        },
      }),
    ]);
    console.log(!!follow);
    console.log({ followerId: userId, followingId: userPageData.id });
    return {
      posts,
      userInfo: {
        username: userPageData.username,
        joiningDate: userPageData.createdAt,
        userId: userPageData.id,
        following: userPageData.FollowingCommunity.length,
        followers,
        userProfilePic: "https://cdn-icons-png.flaticon.com/512/848/848006.png", //REPLACE THIS WITH THE DB ProfilePIC
        userLikes: userLikes.map((el) => el.postId),
        userDislikes: userDislikes.map((el) => el.postId),
      },
      following,
      follow: !!follow,
    };
  } catch (err) {
    console.log(err);
  }
}

export default async function Page({
  params,
}: {
  params: { username: string };
}) {
  const res = await getUserPageInfo(params.username);
  if (!res || !res.userInfo)
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
        <UserInfoContainer
          userInfo={res.userInfo}
          doesUserFollow={res.follow}
        />
        <div className={styles.postContainer}>
          {res.posts.map((el) => (
            <PostCard
              post={el}
              postPage={false}
              key={el.id}
              showPost={true}
              like={res.userInfo.userLikes?.includes(el.id)}
              dislike={res.userInfo.userDislikes?.includes(el.id)}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
