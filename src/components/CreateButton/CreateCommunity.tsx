"use client";
import Link from "next/link";
import styles from "./CreatePost.module.css";

export default function CreateCommunity() {
  return (
    <Link className={styles.createPost} href="/private">
      <img
        src="https://cdn-icons-png.flaticon.com/512/1828/1828575.png"
        alt=""
      />
      <span>Create Community</span>
    </Link>
  );
}
