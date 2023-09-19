import prisma from "@/util/prisma";
import Frame from "./Frame";
import Link from "next/link";
import styles from "./community.module.css";

export default async function Community() {
  const res = await prisma.vortex_Community.findMany();
  return (
    <Frame>
      {res.map((el) => (
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
