"use client";

import Sidebar from "@/components/sidebar/Sidebar";
import styles from "./following.module.css";
import LoadingUserContainer from "../LoadingUserContainer";
import LoadingPostCard from "@/components/PostCard/LoadingPostCard";

export default function LoadingSkeleton() {
  return (
    <main className={styles.container}>
      <Sidebar />
      <div className={styles.pageContainer}>
        <LoadingUserContainer />
        <div className={styles.followingContainer}>
          {[1, 2, 3, 4, 5].map((el) => (
            <LoadingPostCard key={el} />
          ))}
        </div>
      </div>
    </main>
  );
}
