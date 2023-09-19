"use client";
import { useEffect, useState } from "react";
import styles from "./postPage.module.css";
import Like from "@/components/PostCard/like-buttons";
import DisLike from "@/components/PostCard/dislike";
import Link from "next/link";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

type Comment = {
  CommentLike: number;
  CommentDisLike: number;
  hasUserLilked: boolean;
  hasUserDisliked: boolean;
  author: {
    username: string;
  };
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date | null;
  authorId: number;
  postId: number;
};

export default function Comment({ comment }: { comment: Comment }) {
  const [date, setDate] = useState(false);
  const [likeDislikes, setLikeDislike] = useState({
    like: comment.hasUserLilked,
    dislike: comment.hasUserDisliked,
    count: comment.CommentLike - comment.CommentDisLike,
  });
  const axiosPrivate = useAxiosPrivate();
  useEffect(() => {
    setDate(true);
  }, []);
  return (
    <>
      <hr className={styles.hr} />
      <div className={styles.task} key={comment.id}>
        <div className={styles.postDetails}>
          <Link href={`/user/${comment.author.username}`}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/848/848006.png"
              alt={comment.author.username}
            />
            <span>{comment.author.username}</span>
          </Link>
          <span className={styles.relativeTime}>
            {date ? getRelativeTime(new Date(comment.createdAt)) : ""}
          </span>
        </div>
        <p>{comment.content}</p>
        <div className={styles.postInfo}>
          <div className={styles.actionContainer}>
            <span>{likeDislikes.count}</span>
            <button
              className={styles.likeButton}
              onClick={async () => {
                const prevState = { ...likeDislikes };
                if (likeDislikes.dislike)
                  setLikeDislike((prev) => {
                    return {
                      ...prev,
                      dislike: !prev.dislike,
                      count: prev.count + 1,
                    };
                  });
                setLikeDislike((prev) => {
                  return {
                    ...prev,
                    like: !prev.like,
                    count: prev.count + (!prev.like ? +1 : -1),
                  };
                });
                try {
                  await axiosPrivate.put("/api/comment/like", {
                    id: comment.id,
                  });
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
                    return { ...prev, like: !prev.like, count: prev.count - 1 };
                  });
                setLikeDislike((prev) => {
                  return {
                    ...prev,
                    dislike: !prev.dislike,
                    count: prev.count + (!prev.dislike ? -1 : +1),
                  };
                });
                try {
                  await axiosPrivate.put("/api/comment/dislike", {
                    id: comment.id,
                  });
                } catch (err) {
                  setLikeDislike(prevState);
                }
              }}
            >
              <DisLike disLiked={likeDislikes.dislike} />
            </button>
          </div>
        </div>
      </div>
    </>
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
