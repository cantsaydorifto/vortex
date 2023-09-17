"use client";

import { useRef, type ReactNode } from "react";
import styles from "./community.module.css";

export default function Frame({ children }: { children: ReactNode }) {
  const frameContainerRef = useRef<HTMLDivElement>(null);
  const lRef = useRef<HTMLButtonElement>(null);
  const rRef = useRef<HTMLButtonElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  console.log("apples");

  const handleFirstClick = (function () {
    let moved = 0;
    return function (right: boolean) {
      let totalMovement = 0;
      if (!frameRef.current || !frameContainerRef.current) return;
      const width = frameRef.current.clientWidth;
      const FRAME_WIDTH = frameContainerRef.current.clientWidth;
      console.log("FRAME_WIDTH: ", FRAME_WIDTH);
      const availableL = moved;
      const availableR = width - FRAME_WIDTH - moved;
      const toMove = FRAME_WIDTH > 600 ? 400 : 200;
      if (right) {
        toMove > availableR
          ? (totalMovement = availableR)
          : (totalMovement = toMove);
      } else {
        toMove > availableL
          ? (totalMovement = availableL)
          : (totalMovement = toMove);
      }

      frameRef.current.style.transform = `translateX(${
        right ? -1 * moved - totalMovement : -1 * moved + totalMovement
      }px)`;

      right ? (moved += totalMovement) : (moved -= totalMovement);
      if (moved === 0) {
        lRef.current && (lRef.current.style.display = "none");
      } else {
        lRef.current && (lRef.current.style.display = "block");
      }
      if (moved === width - FRAME_WIDTH) {
        rRef.current && (rRef.current.style.display = "none");
      } else {
        rRef.current && (rRef.current.style.display = "block");
      }
    };
  })();

  return (
    <div ref={frameContainerRef} className={styles.frameContainer}>
      <button
        style={{ display: "none" }}
        ref={lRef}
        onClick={() => handleFirstClick(false)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          height="25"
          width="25"
          fill="white"
        >
          <path d="M12.793 19.707l-9-9a1 1 0 010-1.414l9-9 1.414 1.414L5.914 10l8.293 8.293-1.414 1.414z"></path>
        </svg>
      </button>
      <div ref={frameRef} className={styles.frame}>
        {children}
      </div>
      <button ref={rRef} onClick={() => handleFirstClick(true)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          height="25"
          width="25"
          fill="white"
        >
          <path d="M7.207 19.707l-1.414-1.414L14.086 10 5.793 1.707 7.207.293l9 9a1 1 0 010 1.414l-9 9z"></path>
        </svg>
      </button>
    </div>
  );
}
