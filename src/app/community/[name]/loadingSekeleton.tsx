"use client";

import Sidebar from "@/components/sidebar/Sidebar";
import styles from "./communityPage.module.css";
import CommunityInfoLoading from "./CommunityInfoLoading";
import LoadingPostCard from "@/components/PostCard/LoadingPostCard";

export default function LoadingSkeleton() {
  return (
    <main className={styles.container}>
      <Sidebar />
      <div className={styles.comInfoContainer}>
        <div className={styles.postContainer}>
          <div>
            <div>
              <span
                style={{
                  borderRadius: "50%",
                  height: "50px",
                  width: "50px",
                  backgroundColor: "rgb(32,32,32)",
                }}
              ></span>
              <span
                style={{
                  borderRadius: "8px",
                  height: "35px",
                  width: "100px",
                  backgroundColor: "rgb(32,32,32)",
                }}
              ></span>
            </div>
            <span
              style={{
                borderRadius: "20px",
                height: "40px",
                width: "120px",
                backgroundColor: "rgb(32,32,32)",
              }}
            ></span>
          </div>
          {[1, 2, 3, 4, 5].map((el) => (
            <LoadingPostCard key={el} />
          ))}
        </div>
        <CommunityInfoLoading />
      </div>
    </main>
  );
}
