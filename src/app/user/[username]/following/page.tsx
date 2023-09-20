import Sidebar from "@/components/sidebar/Sidebar";
import styles from "./following.module.css";
import prisma from "@/util/prisma";
import { authRefreshVerify } from "@/util/authRefreshVerify";
import UserInfoContainer from "../UserInfoContainer";
import CommunityDescription from "@/app/community/[name]/CommunityDescription";

async function getUserPageInfo(username: string) {
  let userId: number | null = null;
  const userFollowing: number[] = [];

  try {
    const user = await authRefreshVerify();
    userId = user.id;
    userFollowing.push(...user.following);
  } catch (err) {
    console.log(err);
  }
  try {
    const userPageData = await prisma.vortex_User.findUnique({
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
                description: true,
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

    const followers = await prisma.vortex_Follow.count({
      where: {
        followingId: userPageData.id,
      },
    });

    if (!userId) {
      return {
        userInfo: {
          username: userPageData.username,
          joiningDate: userPageData.createdAt,
          userId: userPageData.id,
          following: userPageData.FollowingCommunity.length,
          followers,
          userProfilePic:
            "https://cdn-icons-png.flaticon.com/512/848/848006.png", //REPLACE THIS WITH THE DB ProfilePIC
        },
        followingCommunities: userPageData.FollowingCommunity,
        follow: false,
        userFollowing,
      };
    }
    const follow = await prisma.vortex_Follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: userPageData.id,
        },
      },
    });
    return {
      userInfo: {
        username: userPageData.username,
        joiningDate: userPageData.createdAt,
        userId: userPageData.id,
        following: userPageData.FollowingCommunity.length,
        followers,
        userProfilePic: "https://cdn-icons-png.flaticon.com/512/848/848006.png", //REPLACE THIS WITH THE DB ProfilePIC
      },
      followingCommunities: userPageData.FollowingCommunity,
      follow: !!follow,
      userFollowing,
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
        <h2 className={styles.h2}>Communities Joined :</h2>
        <div className={styles.followingContainer}>
          {res.followingCommunities.map((el) => (
            <div key={el.Community.id}>
              <CommunityDescription
                community={el.Community}
                following={res.userFollowing}
              />
            </div>
          ))}
        </div>
        {/* <div className={styles.postContainer}>
        </div> */}
      </div>
    </main>
  );
}
