"use client";
import type { Community } from "@prisma/client";
import styles from "./communityPage.module.css";

export default function CommunityInfo({ res }: { res: Community | null }) {
  if (!res) return <h2>Not Found!!</h2>;
  return (
    <>
      <div className={styles.comInfo}>
        <img src={res.img} alt={res.name} />
        <div>
          <img src={res.icon} alt={res.name} />
          <span>{res.name[0].toUpperCase() + res.name.slice(1)}</span>
          <button onClick={() => null}>Join</button>
        </div>
        <span>{res.name[0].toUpperCase() + res.name.slice(1)}</span>
        <p>{res.description}</p>
        <div className={styles.comData}>
          <div>
            <span>0</span>
            <span>Members</span>
          </div>
          <div>
            <span>12 Dec</span>
            <span>Created At</span>
          </div>
        </div>
      </div>
    </>
  );
}
