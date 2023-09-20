"use client";
import { useState } from "react";
import styles from "./userPage.module.css";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";

export default function UserInfoContainer({ userInfo, doesUserFollow }: Props) {
  const [follow, setFollow] = useState({
    doesUserFollow,
    followers: userInfo.followers,
  });
  const [loading, setLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  return (
    <div className={styles.userContainer}>
      <span>
        <img src={userInfo.userProfilePic} alt={userInfo.username} />
        <span>
          {userInfo.username[0].toUpperCase() + userInfo.username.slice(1)}
        </span>
        {auth.user ? (
          <button
            className={styles.joinCommunityButton}
            disabled={loading}
            onClick={async () => {
              const prevState = follow;
              try {
                setLoading(true);
                setFollow((prev) => ({
                  ...prev,
                  doesUserFollow: !prev.doesUserFollow,
                  followers: prev.followers + (prev.doesUserFollow ? -1 : +1),
                }));
                await axiosPrivate.put("/api/user/follow/" + userInfo.userId);
                setLoading(false);
              } catch (err) {
                setFollow(prevState);
                setLoading(false);
              }
            }}
          >
            {follow.doesUserFollow ? "UnFollow" : "Follow"}
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
          <span>{follow.followers}</span> Followers
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
        Joined {month(userInfo.joiningDate.getMonth())}{" "}
        {userInfo.joiningDate.getFullYear()}
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
  doesUserFollow: boolean;
};
