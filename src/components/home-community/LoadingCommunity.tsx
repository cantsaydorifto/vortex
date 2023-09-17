"use client";
import Frame from "./Frame";
import styles from "./community.module.css";

export default function LoadingCommunity() {
  const res = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  return (
    <Frame>
      {res.map((el) => (
        <span
          key={el}
          style={{
            backgroundColor: "rgb(40, 40, 40)",
            borderRadius: "20px",
          }}
          className={styles.frameElement}
        />
      ))}
    </Frame>
  );
}
