"use client";

import type { Post } from "@prisma/client";
import styles from "./post.module.css";
import Like from "./like-buttons";
import { useState } from "react";
import DisLike from "./dislike";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

export default function PostCard({
  post,
  like,
  dislike,
}: {
  post: (Post & { author: { username: string } }) | null;
  like: boolean;
  dislike: boolean;
}) {
  const [likeDislikes, setLikeDislike] = useState({
    like,
    dislike,
  });
  const axiosPrivate = useAxiosPrivate();
  if (!post) {
    return (
      <div className={styles.task}>
        <div className={styles.postDetails}>
          <span>
            <img
              src="https://cdn-icons-png.flaticon.com/512/848/848006.png"
              alt={"loading"}
            />
            <span>username</span>
          </span>
          <span className={styles.relativeTime}>__ days ago</span>
        </div>
        <p>{"title"}</p>
        <p>{"content"}</p>
        <div className={styles.actionContainer}>
          <button className={styles.likeButton} onClick={() => null}>
            <Like liked={likeDislikes.like} />
          </button>
          <button className={styles.likeButton} onClick={() => null}>
            <DisLike disLiked={likeDislikes.dislike} />
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className={styles.task} key={post.id}>
      <div className={styles.postDetails}>
        <span>
          <img
            src="https://cdn-icons-png.flaticon.com/512/848/848006.png"
            alt={post.author.username}
          />
          <span>{post.author.username}</span>
        </span>
        <span className={styles.relativeTime}>
          {getRelativeTime(new Date(post.createdAt))}
        </span>
      </div>
      <p>{post.title}</p>
      <p>{post.content}</p>
      <div className={styles.actionContainer}>
        <button
          className={styles.likeButton}
          onClick={async () => {
            const prevState = { ...likeDislikes };
            if (likeDislikes.dislike)
              setLikeDislike((prev) => {
                return { ...prev, dislike: !prev.dislike };
              });
            setLikeDislike((prev) => {
              return { ...prev, like: !prev.like };
            });
            try {
              await axiosPrivate.put("/api/like", { id: post.id });
            } catch (err) {
              setLikeDislike(prevState);
            }
          }}
        >
          <Like liked={likeDislikes.like} />
        </button>
        <button
          className={styles.likeButton}
          onClick={async () => {
            const prevState = { ...likeDislikes };
            if (likeDislikes.like)
              setLikeDislike((prev) => {
                return { ...prev, like: !prev.like };
              });
            setLikeDislike((prev) => {
              return { ...prev, dislike: !prev.dislike };
            });
            try {
              await axiosPrivate.put("/api/dislike", { id: post.id });
            } catch (err) {
              setLikeDislike(prevState);
            }
          }}
        >
          <DisLike disLiked={likeDislikes.dislike} />
        </button>
      </div>
    </div>
  );
}

function getRelativeTime(timeStamp: Date) {
  const now = new Date();
  const secondsPast = (now.getTime() - timeStamp.getTime()) / 1000;
  if (secondsPast < 60) {
    const secondsAgo = Math.floor(secondsPast);
    return secondsAgo > 1
      ? `${secondsAgo} seconds ago`
      : `${secondsAgo} second ago`;
  }
  if (secondsPast < 3600) {
    const minutesAgo = Math.floor(secondsPast / 60);
    return minutesAgo > 1
      ? `${minutesAgo} minutes ago`
      : `${minutesAgo} minute ago`;
  }
  if (secondsPast <= 86400) {
    const hoursAgo = Math.floor(secondsPast / 3600);
    return hoursAgo > 1 ? `${hoursAgo} hours ago` : `${hoursAgo} hour ago`;
  }
  if (secondsPast <= 2628000) {
    const daysAgo = Math.floor(secondsPast / 86400);
    return daysAgo > 1 ? `${daysAgo} days ago` : `${daysAgo} da ago`;
  }
  if (secondsPast <= 31536000) {
    const monthsAgo = Math.floor(secondsPast / 2628000);
    return monthsAgo > 1 ? `${monthsAgo} months ago` : `${monthsAgo} month ago`;
  }
  if (secondsPast > 31536000) {
    const yearsAgo = Math.floor(secondsPast / 31536000);
    return yearsAgo > 1 ? `${yearsAgo} years ago` : `${yearsAgo} year ago`;
  }
}
