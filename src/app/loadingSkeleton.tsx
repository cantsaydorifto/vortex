"use client";

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
