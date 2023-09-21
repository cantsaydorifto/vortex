"use client";
import { useState } from "react";
import styles from "./userPage.module.css";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";

export default function UserInfoContainer({ userInfo }: Props) {
  const {
    auth: { user },
    setAuth,
  } = useAuth();
  const [followerCount, setFollowerCount] = useState(userInfo.followers);
  const [loading, setLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  return (
    <div className={styles.userContainer}>
      <span>
        <img src={userInfo.userProfilePic} alt={userInfo.username} />
        <span>
          {userInfo.username[0].toUpperCase() + userInfo.username.slice(1)}
        </span>
        {user ? (
          <button
            className={styles.joinCommunityButton}
            disabled={loading}
            onClick={async () => {
              const prevState = {
                ...user,
                userPostLikes: [...user.userPostLikes],
                userPostDislikes: [...user.userPostDislikes],
                userCommentLikes: [...user.userCommentLikes],
                userCommentDislikes: [...user.userCommentDislikes],
                followingUsers: [...user.followingUsers],
                followingCommunities: [...user.followingCommunities],
              };
              let countToAdd = 0;
              try {
                setLoading(true);
                setAuth((prev) => {
                  if (!prev.user) return prev;
                  const userFollowing = prev.user.followingUsers.includes(
                    userInfo.userId
                  );
                  countToAdd = userFollowing ? -1 : +1;
                  return {
                    ...prev,
                    user: {
                      ...prev.user,
                      followingUsers: userFollowing
                        ? prev.user.followingUsers.filter(
                            (el) => el !== userInfo.userId
                          )
                        : [...prev.user.followingUsers, userInfo.userId],
                    },
                  };
                });
                setFollowerCount((prev) => prev + countToAdd);
                await axiosPrivate.put("/api/user/follow/" + userInfo.userId);
                setLoading(false);
              } catch (err) {
                setAuth((prev) => ({ ...prev, user: prevState }));
                setFollowerCount((prev) => prev - countToAdd);
                setLoading(false);
              }
            }}
          >
            {user?.followingUsers.includes(userInfo.userId)
              ? "UnFollow"
              : "Follow"}
          </button>
        ) : (
          <button
            disabled={true}
            style={{
              cursor: "not-allowed",
            }}
            className={styles.joinCommunityButton}
          >
            Follow
          </button>
        )}
      </span>
      <div className={styles.follow}>
        <p>
          <span>{followerCount}</span> Followers
        </p>
        <p>
          <span>{userInfo.following}</span>{" "}
          <Link href={`/user/${userInfo.username}/following`}>Following</Link>
        </p>
      </div>
      <div>
        <img
          src="https://cdn-icons-png.flaticon.com/512/591/591607.png"
          alt=""
        />
        Joined {month(new Date(userInfo.joiningDate).getMonth())}{" "}
        {new Date(userInfo.joiningDate).getFullYear()}
      </div>
    </div>
  );
}

function month(month: number) {
  return [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ][month];
}

type Props = {
  userInfo: {
    username: string;
    userId: number;
    joiningDate: Date;
    userProfilePic: string;
    followers: number;
    following: number;
  };
};
