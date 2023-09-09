import prisma from "@/util/prisma";
import styles from "./styles.module.css";
import Link from "next/link";

export default async function PopularCommunites() {
  const res = await prisma.community.findMany({ take: 5 });
  return (
    <div className={styles.popularCommunites}>
      <h3>POPULAR COMMUNITIES</h3>
      {res.map((el) => (
        <Link key={el.id} href={`/community/${el.name}`}>
          <img src={el.icon} alt={el.name} />
          <span>{el.name[0].toUpperCase() + el.name.slice(1)}</span>
        </Link>
      ))}
    </div>
  );
}
