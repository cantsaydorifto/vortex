"use client";

import type { vortex_Post as Post } from "@prisma/client";
import styles from "./post.module.css";
import Like from "./like-buttons";
import { useEffect, useState } from "react";
import DisLike from "./dislike";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";

export default function PostCard({
  post,
  postPage,
  showPost,
}: {
  post:
    | (Post & {
        Likes: number;
        DisLikes: number;
        Comment: number;
        Community: {
          id: number;
          name: string;
          icon: string;
        };
        author: { username: string };
      })
    | null;
  showPost: boolean;
  postPage: boolean;
}) {
  useEffect(() => {
    setDate(true);
  }, []);
  const {
    auth: { user },
    setAuth,
  } = useAuth();
  const [date, setDate] = useState(false);
  const [count, setCount] = useState(post ? post.Likes - post.DisLikes : 0);
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
            <Like liked={false} />
          </button>
          <button className={styles.likeButton} onClick={() => null}>
            <DisLike disLiked={false} />
          </button>
        </div>
      </div>
    );
  }
  return (
    <div
      style={{
        backgroundColor: postPage ? "transparent" : "rgb(28, 28, 28)",
        paddingLeft: postPage ? "0" : "15px",
      }}
      className={styles.task}
      key={post.id}
    >
      <div className={styles.postDetails}>
        <Link href={`/user/${post.author.username}`}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/848/848006.png"
            alt={post.author.username}
          />
          <span>{post.author.username}</span>
        </Link>
        <span className={styles.relativeTime}>
          {date ? getRelativeTime(new Date(post.createdAt)) : ""}
        </span>
      </div>
      <p>{post.title}</p>
      <p>{post.content}</p>
      <div className={styles.postInfo}>
        <div>
          <div
            style={{
              backgroundColor: !postPage ? "transparent" : "rgb(32, 32, 32)",
            }}
            className={styles.actionContainer}
          >
            <span>{count}</span>
            <button
              className={styles.likeButton}
              onClick={async () => {
                if (!user) return;
                const prevState = {
                  ...user,
                  userPostLikes: [...user.userPostLikes],
                  userPostDislikes: [...user.userPostDislikes],
                  userCommentLikes: [...user.userCommentLikes],
                  userCommentDislikes: [...user.userCommentDislikes],
                };

                if (user.userPostDislikes.includes(post.id)) {
                  setCount((prev) => prev + 1);
                  setAuth((prev) => {
                    if (!prev.user) return prev;
                    return {
                      ...prev,
                      user: {
                        ...prev.user,
                        userPostDislikes: prev.user.userPostDislikes.filter(
                          (el) => el !== post.id
                        ),
                      },
                    };
                  });
                }
                if (user.userPostLikes.includes(post.id)) {
                  setCount((prev) => prev - 1);
                  setAuth((prev) => {
                    if (!prev.user) return prev;
                    return {
                      ...prev,
                      user: {
                        ...prev.user,
                        userPostLikes: prev.user.userPostLikes.filter(
                          (el) => el !== post.id
                        ),
                      },
                    };
                  });
                } else {
                  setCount((prev) => prev + 1);
                  setAuth((prev) => {
                    if (!prev.user) return prev;
                    return {
                      ...prev,
                      user: {
                        ...prev.user,
                        userPostLikes: [...prev.user.userPostLikes, post.id],
                      },
                    };
                  });
                }
                try {
                  await axiosPrivate.put("/api/like", { id: post.id });
                } catch (err) {
                  setAuth((prev) => ({ ...prev, user: prevState }));
                }
              }}
            >
              <Like liked={!!user?.userPostLikes.includes(post.id)} />
            </button>
            <button
              className={styles.likeButton}
              onClick={async () => {
                if (!user) return;
                const prevState = {
                  ...user,
                  userPostLikes: [...user.userPostLikes],
                  userPostDislikes: [...user.userPostDislikes],
                  userCommentLikes: [...user.userCommentLikes],
                  userCommentDislikes: [...user.userCommentDislikes],
                };
                if (user.userPostLikes.includes(post.id)) {
                  setCount((prev) => prev - 1);
                  setAuth((prev) => {
                    if (!prev.user) return prev;
                    return {
                      ...prev,
                      user: {
                        ...prev.user,
                        userPostLikes: prev.user.userPostLikes.filter(
                          (el) => el !== post.id
                        ),
                      },
                    };
                  });
                }
                if (user.userPostDislikes.includes(post.id)) {
                  setCount((prev) => prev + 1);
                  setAuth((prev) => {
                    if (!prev.user) return prev;
                    return {
                      ...prev,
                      user: {
                        ...prev.user,
                        userPostDislikes: prev.user.userPostDislikes.filter(
                          (el) => el !== post.id
                        ),
                      },
                    };
                  });
                } else {
                  setCount((prev) => prev - 1);
                  setAuth((prev) => {
                    if (!prev.user) return prev;
                    return {
                      ...prev,
                      user: {
                        ...prev.user,
                        userPostDislikes: [
                          ...prev.user.userPostDislikes,
                          post.id,
                        ],
                      },
                    };
                  });
                }
                try {
                  await axiosPrivate.put("/api/dislike", { id: post.id });
                } catch (err) {
                  setAuth((prev) => ({ ...prev, user: prevState }));
                }
              }}
            >
              <DisLike disLiked={!!user?.userPostDislikes.includes(post.id)} />
            </button>
          </div>
          <Link
            style={{
              backgroundColor: !postPage ? "transparent" : "rgb(32, 32, 32)",
            }}
            href={`/post/${post.id}`}
            className={styles.comment}
          >
            <svg fill="white" height="20" width="20">
              <path d="M7.725 19.872a.718.718 0 0 1-.607-.328.725.725 0 0 1-.118-.397V16H3.625A2.63 2.63 0 0 1 1 13.375v-9.75A2.629 2.629 0 0 1 3.625 1h12.75A2.63 2.63 0 0 1 19 3.625v9.75A2.63 2.63 0 0 1 16.375 16h-4.161l-4 3.681a.725.725 0 0 1-.489.191ZM3.625 2.25A1.377 1.377 0 0 0 2.25 3.625v9.75a1.377 1.377 0 0 0 1.375 1.375h4a.625.625 0 0 1 .625.625v2.575l3.3-3.035a.628.628 0 0 1 .424-.165h4.4a1.377 1.377 0 0 0 1.375-1.375v-9.75a1.377 1.377 0 0 0-1.374-1.375H3.625Z"></path>
            </svg>
            <span>{post.Comment}</span>
          </Link>
        </div>
        {!!showPost && (
          <Link
            className={styles.comDetails}
            href={`/community/${post.Community.name}`}
          >
            <img src={post.Community.icon} alt={post.Community.name} />
            {post.Community.name[0].toUpperCase() +
              post.Community.name.slice(1)}
          </Link>
        )}
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
    return daysAgo > 1 ? `${daysAgo} days ago` : `${daysAgo} day ago`;
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
