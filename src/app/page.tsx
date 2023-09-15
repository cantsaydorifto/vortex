import PostCard from "@/components/PostCard/PostCard";
import styles from "./page.module.css";
import Community from "@/components/home-community/Community";
import PopularCommunites from "@/components/popularCommunites/PopularCommunites";
import Sidebar from "@/components/sidebar/Sidebar";

export default function Home() {
  return (
    <main className={styles.main}>
      <Sidebar />
      <div className={styles.content}>
        <Community />
        <div>
          <div>
            <PostCard postPage={false} post={null} />
            <PostCard postPage={false} post={null} />
            <PostCard postPage={false} post={null} />
            <PostCard postPage={false} post={null} />
            <PostCard postPage={false} post={null} />
          </div>
          <PopularCommunites />
        </div>
      </div>
    </main>
  );
}
