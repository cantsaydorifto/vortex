import Sidebar from "@/components/sidebar/Sidebar";
import styles from "./page.module.css";
import LoadingCommunity from "@/components/home-community/LoadingCommunity";
import LoadingPostCard from "@/components/PostCard/LoadingPostCard";
import LoadingPopularCommunites from "@/components/popularCommunites/LoadingPopularCommunities";

export default function LoadingSkeleton() {
  return (
    <main className={styles.main}>
      <Sidebar />
      <div className={styles.content}>
        <LoadingCommunity />
        <div>
          <div>
            {/* <div>
              <Link href="/post/create" className={styles.createPostLink}>
                <img
                  src="https://cdn-icons-png.flaticon.com/512/848/848006.png"
                  alt="User"
                />
                <input type="text" placeholder="Create Post" />
              </Link>
              <Link className={styles.createPost} href="/private">
                <span>Create Community</span>
              </Link>
            </div> */}
            {[1, 2, 3, 4].map((el) => (
              <LoadingPostCard key={el} />
            ))}
          </div>
          <LoadingPopularCommunites />
        </div>
      </div>
    </main>
  );
}
