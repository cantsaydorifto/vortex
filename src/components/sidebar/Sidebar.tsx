import prisma from "@/util/prisma";
import styles from "./sidebar.module.css";

export default async function Sidebar() {
  const res = await prisma.community.findMany();
  res.push({ ...res[res.length - 3] });
  res[res.length - 1].id = 100;
  return (
    <div className={styles.sidebar}>
      <div>
        <svg
          className="text-neutral-content-weak text-20 ml-[0.375rem] col-start-2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          height="20"
          width="20"
          icon-name="home-outline"
          fill="currentColor"
        >
          <path d="M17.75 8.565L19 9.4v8.551A1.053 1.053 0 0117.943 19h-5.2a.71.71 0 01-.712-.709v-4.522c0-.762-1.147-1.479-2.036-1.479s-2.036.717-2.036 1.479v4.522a.711.711 0 01-.707.709H2.057A1.052 1.052 0 011 17.954V9.4l1.25-.838v9.188h4.464v-3.981c0-1.538 1.766-2.729 3.286-2.729s3.286 1.191 3.286 2.729v3.981h4.464V8.565zm2.05-1.789L10.65.646A1.126 1.126 0 009.362.638L.2 6.776l.7 1.039 9.1-6.1 9.1 6.1.7-1.039z"></path>
        </svg>
        <span>Home</span>
      </div>
      <div>
        <svg
          className="text-neutral-content-weak text-20 ml-[0.375rem] col-start-2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          height="20"
          width="20"
          icon-name="popular-outline"
          fill="currentColor"
        >
          <g clipPath="url(#clip0_474_48)">
            <path d="M10 0a10 10 0 1010 10A10.011 10.011 0 0010 0zm0 18.75a8.7 8.7 0 01-5.721-2.145l8.471-8.471v4.148H14V6.638A.647.647 0 0013.362 6H7.718v1.25h4.148L3.4 15.721A8.739 8.739 0 1110 18.75z"></path>
          </g>
          <defs>
            <clipPath id="clip0_474_48">
              <path d="M0 0h20v20H0z"></path>
            </clipPath>
          </defs>
        </svg>
        <span>New</span>
      </div>
      <hr />
      <h2>Communities</h2>
      {res.map((el) => (
        <div key={el.id}>
          <img src={el.icon} alt={el.name} />
          <span>{el.name[0].toUpperCase() + el.name.slice(1)}</span>
        </div>
      ))}
    </div>
  );
}
