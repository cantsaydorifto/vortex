"use client";
import styles from "./communityPage.module.css";

export default function CommunityInfoLoading() {
  return (
    <div
      style={{
        backgroundColor: "rgb(24,24,24)",
      }}
      className={styles.comInfo}
    >
      <span
        style={{
          borderTopLeftRadius: "12px",
          borderTopRightRadius: "12px",
          height: "200px",
          width: "100%",
          backgroundColor: "rgb(32,32,32)",
        }}
      />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span
          style={{
            borderRadius: "50%",
            height: "40px",
            width: "40px",
            backgroundColor: "rgb(32,32,32)",
          }}
        ></span>
        <span
          style={{
            borderRadius: "12px",
            height: "40px",
            width: "180px",
            backgroundColor: "rgb(32,32,32)",
          }}
        />
        <span
          style={{
            borderRadius: "18px",
            height: "26px",
            width: "60px",
            backgroundColor: "rgb(32,32,32)",
          }}
        ></span>
      </div>
      <span
        style={{
          borderRadius: "8px",
          height: "20px",
          marginLeft: "20px",
          width: "80px",
          backgroundColor: "rgb(32,32,32)",
        }}
      ></span>
      <p
        style={{
          borderRadius: "8px",
          height: "80px",
          marginLeft: "20px",
          width: "calc(100% - 40px)",
          backgroundColor: "rgb(32,32,32)",
        }}
      ></p>
      <div className={styles.comData}>
        <div>
          <span
            style={{
              borderRadius: "8px",
              height: "40px",
              width: "80px",
              backgroundColor: "rgb(32,32,32)",
            }}
          />
        </div>
        <div>
          <span
            style={{
              borderRadius: "8px",
              height: "40px",
              width: "80px",
              backgroundColor: "rgb(32,32,32)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
