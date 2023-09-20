"use client";

import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useState } from "react";
import styles from "./communityPage.module.css";
import useAuth from "@/hooks/useAuth";

export default function JoinCommunityButton({
  id,
  hidden,
}: {
  id: number;
  hidden: boolean;
}) {
  const axiosPrivate = useAxiosPrivate();
  const {
    auth: { user },
    setAuth,
  } = useAuth();
  const [loading, setLoading] = useState(false);
  const following = !!user?.followingCommunities.includes(id);
  return user ? (
    <button
      disabled={loading}
      key={following ? "Join" : "Leave"}
      className={`${styles.joinCommunityButton}${
        hidden ? " " + styles.hiddenJoinCommunityButton : ""
      }`}
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
        try {
          setLoading(true);
          setAuth((prev) => {
            if (!prev.user) return prev;
            return {
              ...prev,
              user: {
                ...prev.user,
                followingCommunities: prev.user.followingCommunities.includes(
                  id
                )
                  ? prev.user.followingCommunities.filter((el) => el !== id)
                  : [...prev.user.followingCommunities, id],
              },
            };
          });
          await axiosPrivate.put("/api/community/follow/" + id);
          setLoading(false);
        } catch (err) {
          // console.log(err);
          setAuth((prev) => ({ ...prev, user: prevState }));
          setLoading(false);
        }
      }}
    >
      {!following ? "Join" : "Leave"}
    </button>
  ) : (
    <button
      disabled={true}
      style={{
        cursor: "not-allowed",
      }}
      className={`${styles.joinCommunityButton}${
        hidden ? " " + styles.hiddenJoinCommunityButton : ""
      }`}
    >
      Join
    </button>
  );
}
