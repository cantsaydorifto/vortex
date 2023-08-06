import prisma from "@/util/prisma";
import styles from "./styles.module.css";

export default async function PopularCommunites() {
  const res = await prisma.community.findMany();
  return (
    <div className={styles.popularCommunites}>
      <h3>POPULAR COMMUNITIES</h3>
      {res.map((el) => (
        <div key={el.id}>
          <img src={el.icon} alt={el.name} />
          <span>{el.name[0].toUpperCase() + el.name.slice(1)}</span>
        </div>
      ))}
    </div>
  );
}
