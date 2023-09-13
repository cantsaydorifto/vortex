"use client";
import type { Community } from "@prisma/client";
import styles from "./communityPage.module.css";
import JoinCommunityButton from "./JoinCommunityButton";

export default function CommunityInfo({
  res,
  following,
}: {
  res: Community | null;
  following: boolean;
}) {
  if (!res) return <h2>Not Found!!</h2>;
  return (
    <div className={styles.comInfo}>
      <img src={res.img} alt={res.name} />
      <div>
        <img src={res.icon} alt={res.name} />
        <span>{res.name[0].toUpperCase() + res.name.slice(1)}</span>
        <JoinCommunityButton hidden={false} following={following} id={res.id} />
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
