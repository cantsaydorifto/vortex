"use client";
import styles from "./styles.module.css";
import Link from "next/link";

export default function PopularCommunites({
  communities,
}: {
  communities: {
    id: number;
    name: string;
    icon: string;
  }[];
}) {
  return (
    <div className={styles.popularCommunites}>
      <h3>POPULAR COMMUNITIES</h3>
      {communities.slice(0, 5).map((el) => (
        <Link key={el.id} href={`/community/${el.name}`}>
          <img src={el.icon} alt={el.name} />
          <span>{el.name[0].toUpperCase() + el.name.slice(1)}</span>
        </Link>
      ))}
    </div>
  );
}
