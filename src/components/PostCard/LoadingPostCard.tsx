"use client";

import styles from "./post.module.css";

export default function LoadingPostCard() {
  return (
    <div
      className={styles.task}
      style={{
        backgroundColor: "rgb(24,24,24)",
      }}
      key={"Loading PostCard"}
    >
      <div className={styles.postDetails}>
        <span>
          <span
            style={{
              borderRadius: "50%",
              height: "30px",
              width: "30px",
              backgroundColor: "rgb(32,32,32)",
            }}
          />
          <span
            style={{
              borderRadius: "8px",
              height: "20px",
              width: "70px",
              backgroundColor: "rgb(32,32,32)",
            }}
          />
        </span>
        <span
          style={{
            borderRadius: "8px",
            height: "30px",
            width: "70px",
            backgroundColor: "rgb(32,32,32)",
          }}
        />
      </div>
      <p
        style={{
          borderRadius: "8px",
          height: "30px",
          width: "120px",
          backgroundColor: "rgb(32,32,32)",
        }}
      />
      <p
        style={{
          borderRadius: "8px",
          height: "80px",
          width: "800px",
          backgroundColor: "rgb(32,32,32)",
        }}
      />
      <div className={styles.postInfo}>
        <span
          style={{
            borderRadius: "8px",
            height: "40px",
            width: "82px",
            backgroundColor: "rgb(32,32,32)",
          }}
          className={styles.actionContainer}
        ></span>
        <span
          style={{
            borderRadius: "8px",
            height: "40px",
            width: "60px",
            backgroundColor: "rgb(32,32,32)",
          }}
        />
      </div>
    </div>
  );
}
