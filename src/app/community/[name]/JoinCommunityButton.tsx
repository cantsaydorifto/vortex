"use client";

import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useState } from "react";
import styles from "./communityPage.module.css";

export default function JoinCommunityButton({
  following,
  id,
  hidden,
}: {
  following: boolean;
  id: number;
  hidden: boolean;
}) {
  const axiosPrivate = useAxiosPrivate();
  const [follow, setFollow] = useState(following);
  const [loading, setLoading] = useState(false);
  return (
    <button
      disabled={loading}
      key={!follow ? "Join" : "Leave"}
      className={`${styles.joinCommunityButton}${
        hidden ? " " + styles.hiddenJoinCommunityButton : ""
      }`}
      onClick={async () => {
        const prevState = follow;
        try {
          setLoading(true);
          setFollow((prev) => !prev);
          await axiosPrivate.put("/api/community/follow/" + id);
          setLoading(false);
        } catch (err) {
          // console.log(err);
          setFollow(prevState);
          setLoading(false);
        }
      }}
    >
      {!follow ? "Join" : "Leave"}
    </button>
  );
}
