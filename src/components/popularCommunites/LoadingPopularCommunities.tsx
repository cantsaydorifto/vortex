"use client";

import styles from "./styles.module.css";

export default function LoadingPopularCommunites() {
  return (
    <div className={styles.popularCommunites}>
      <div
        style={{
          width: "90%",
          height: "25px",
          marginBottom: "-10px",
          borderRadius: "6px",
          backgroundColor: "rgb(40, 40, 40)",
        }}
      />
      {[1, 2, 3, 4, 5].map((el) => (
        <span
          style={{
            width: "100%",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: "10px",
            padding: "0 5px",
          }}
          key={el}
        >
          <div
            style={{
              width: "25px",
              height: "25px",
              borderRadius: "50%",
              backgroundColor: "rgb(40, 40, 40)",
            }}
          />
          <div
            style={{
              width: "150px",
              height: "60%",
              borderRadius: "6px",
              backgroundColor: "rgb(40, 40, 40)",
            }}
          />
        </span>
      ))}
    </div>
  );
}
