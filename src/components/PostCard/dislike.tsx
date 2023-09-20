"use client";

import styles from "./post.module.css";

export default function DisLike({ disLiked }: { disLiked: boolean }) {
  const key = disLiked ? "dis" : "not-disdisLiked";
  return disLiked ? (
    <svg
      style={{ rotate: "180deg" }}
      key={key}
      className={styles.like}
      fill="rgb(83, 83, 179)"
      height="20"
      width="20"
      icon-name="upvote-outline"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M 12.877 19 H 7.123 A 1.125 1.125 0 0 1 6 17.877 V 11 H 2.126 a 1.114 1.114 0 0 1 -1.007 -0.7 a 1.249 1.249 0 0 1 0.171 -1.343 L 9.166 0.368 a 1.128 1.128 0 0 1 1.668 0.004 l 7.872 8.581 a 1.25 1.25 0 0 1 0.176 1.348 a 1.113 1.113 0 0 1 -1.005 0.7 H 14 v 6.877 A 1.125 1.125 0 0 1 12.877 19 Z M 7.25 17.75 h 5.5 v -8 h -10.75 L 10 1.31 L 2.258 9.75 H 13 v 8 Z M 2.227 9.784 l -0.012 0.016 c 0.01 -0.006 0.014 -0.01 0.012 -0.016 Z"></path>{" "}
    </svg>
  ) : (
    <svg
      key={key}
      style={{ rotate: "180deg" }}
      className={styles.like}
      fill="rgb(83, 83, 179)"
      height="20"
      width="20"
      icon-name="upvote-outline"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12.877 19H7.123A1.125 1.125 0 0 1 6 17.877V11H2.126a1.114 1.114 0 0 1-1.007-.7 1.249 1.249 0 0 1 .171-1.343L9.166.368a1.128 1.128 0 0 1 1.668.004l7.872 8.581a1.25 1.25 0 0 1 .176 1.348 1.113 1.113 0 0 1-1.005.7H14v6.877A1.125 1.125 0 0 1 12.877 19ZM7.25 17.75h5.5v-8h4.934L10 1.31 2.258 9.75H7.25v8ZM2.227 9.784l-.012.016c.01-.006.014-.01.012-.016Z"></path>{" "}
    </svg>
  );
}
