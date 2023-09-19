"use client";
import Frame from "./Frame";
import Link from "next/link";
import styles from "./community.module.css";

export default function Community({
  communities,
}: {
  communities: {
    id: number;
    name: string;
    img: string;
    icon: string;
  }[];
}) {
  return (
    <Frame>
      {communities.map((el) => (
        <Link
          className={styles.frameElement}
          href={`/community/${el.name}`}
          key={el.id}
        >
          <img src={el.img} alt={el.name} />
          <div>
            <img src={el.icon} alt={el.name} />
            <span>{el.name}</span>
          </div>
        </Link>
      ))}
    </Frame>
  );
}
