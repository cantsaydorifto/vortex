import prisma from "@/util/prisma";
import styles from "./communityPage.module.css";

export default async function CommunityInfo({
  params,
}: {
  params: { name: string };
}) {
  const res = await prisma.community.findUnique({
    where: {
      name: params.name,
    },
  });
  if (!res) return <h2>Not Found!!</h2>;
  return (
    <div className={styles.comInfo}>
      <img src={res.img} alt={res.name} />
      <div>
        <img src={res.icon} alt={res.name} />
        <span>{res.name[0].toUpperCase() + res.name.slice(1)}</span>
        <button>Join</button>
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
  );
}
