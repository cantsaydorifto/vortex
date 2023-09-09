"use client";
import type { Community } from "@prisma/client";
import styles from "./communityPage.module.css";
import { useState } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

export default function CommunityInfo({
  res,
  following,
}: {
  res: Community | null;
  following: boolean;
}) {
  const [follow, setFollow] = useState(following);
  const [loading, setLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  if (!res) return <h2>Not Found!!</h2>;
  return (
    <div className={styles.comInfo}>
      <img src={res.img} alt={res.name} />
      <div>
        <img src={res.icon} alt={res.name} />
        <span>{res.name[0].toUpperCase() + res.name.slice(1)}</span>
        <button
          disabled={loading}
          key={!follow ? "Join" : "Leave"}
          onClick={async () => {
            const prevState = follow;
            try {
              setLoading(true);
              setFollow((prev) => !prev);
              await axiosPrivate.put("/api/community/follow/" + res.id);
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
      </div>
      <span>{res.name[0].toUpperCase() + res.name.slice(1)}</span>
      <p>{res.description}</p>
      <div className={styles.comData}>
        <div>
          <span>0</span>
          <span>Members</span>
        </div>
        <div>
          <span>
            {res.createdAt.getDate() + " " + month(res.createdAt.getMonth())}
          </span>
          <span>Created At</span>
        </div>
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
