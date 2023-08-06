import prisma from "@/util/prisma";
import Frame from "./Frame";

export default async function Community() {
  const res = await prisma.community.findMany();
  return (
    <Frame>
      {res.map((el) => (
        <div key={el.id}>
          <img src={el.img} alt={el.name} />
          <div>
            <img src={el.icon} alt={el.name} />
            <span>{el.name}</span>
          </div>
        </div>
      ))}
      {res.map((el) => (
        <div key={el.id}>
          <img src={el.img} alt={el.name} />
          <div>
            <img src={el.icon} alt={el.name} />
            <span>{el.name}</span>
          </div>
        </div>
      ))}
    </Frame>
  );
}
