"use client";
import Link from "next/link";
import styles from "./CreatePost.module.css";

export default function CreatePost() {
  return (
    <Link className={styles.createPost} href="/post/create">
      <img
        src="https://cdn-icons-png.flaticon.com/512/1828/1828575.png"
        alt=""
      />
      <span>Create Post</span>
    </Link>
  );
}
