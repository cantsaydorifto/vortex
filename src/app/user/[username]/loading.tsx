import Sidebar from "@/components/sidebar/Sidebar";
import styles from "./userPage.module.css";
import LoadingPostCard from "@/components/PostCard/LoadingPostCard";
import LoadingUserContainer from "./LoadingUserContainer";

export default function Loading({ params }: { params: { username: string } }) {
  return (
    <main className={styles.container}>
      <Sidebar />
      <div className={styles.pageContainer}>
        <LoadingUserContainer />
        <div className={styles.postContainer}>
          {[1, 2, 3, 4, 5].map((el) => (
            <LoadingPostCard key={el} />
          ))}
        </div>
      </div>
    </main>
  );
}
