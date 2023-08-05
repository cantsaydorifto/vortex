import prisma from "@/util/prisma";
import styles from "./community.module.css";

export default async function Community() {
  const res = await prisma.community.findMany();
  return (
    <div className={styles.frame}>
      {res.map((el) => (
        <div key={el.id}>
          <img src={el.img} alt={el.name} />
          <div>
            <img src={el.icon} alt={el.name} />
            <span>{el.name}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
