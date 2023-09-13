import Sidebar from "@/components/sidebar/Sidebar";
import styles from "./postPage.module.css";
import LoadingPostCard from "@/components/PostCard/LoadingPostCard";
import React from "react";

export default function Loading() {
  return (
    <main className={styles.container}>
      <Sidebar />
      <div className={styles.commentContainer}>
        <LoadingPostCard postPage={true} />
        <hr className={styles.hr} />
        <span
          style={{
            borderRadius: "8px",
            height: "32px",
            width: "100px",
            backgroundColor: "rgb(32,32,32)",
          }}
        />
        <span
          style={{
            borderRadius: "8px",
            height: "100px",
            width: "840px",
            backgroundColor: "rgb(32,32,32)",
          }}
        />
        <span
          style={{
            borderRadius: "8px",
            height: "32px",
            width: "100px",
            backgroundColor: "rgb(32,32,32)",
          }}
        ></span>
        {[1, 2, 3, 4, 5].map((el) => (
          <React.Fragment key={el}>
            <hr className={styles.hr} />
            <LoadingPostCard postPage={true} key={el} />
          </React.Fragment>
        ))}
      </div>
    </main>
  );
}
