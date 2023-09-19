"use client";
import styles from "./userPage.module.css";

export default function LoadingUserContainer() {
  return (
    <div className={styles.userContainer}>
      <span>
        <span
          style={{
            backgroundColor: "rgb(32,32,32)",
            borderRadius: "50%",
            height: "50px",
            width: "50px",
          }}
        />
        <span
          style={{
            backgroundColor: "rgb(32,32,32)",
            borderRadius: "8px",
            height: "30px",
            width: "90px",
          }}
        />
        <span
          style={{
            backgroundColor: "rgb(32,32,32)",
            borderRadius: "8px",
            height: "30px",
            width: "60px",
          }}
        />
      </span>
      <div className={styles.follow}>
        <span
          style={{
            backgroundColor: "rgb(32,32,32)",
            borderRadius: "8px",
            height: "25px",
            width: "90px",
          }}
        />
        <span
          style={{
            backgroundColor: "rgb(32,32,32)",
            borderRadius: "8px",
            height: "25px",
            width: "90px",
          }}
        />
      </div>
      <span
        style={{
          backgroundColor: "rgb(32,32,32)",
          borderRadius: "8px",
          height: "25px",
          width: "200px",
        }}
      />
    </div>
  );
}
