"use client";

import useAuth from "@/hooks/useAuth";
import Comment from "./Comment";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Comment = {
  CommentLike: number;
  CommentDisLike: number;
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

export default function Comments({
  comments,
  postId,
}: {
  comments: Comment[];
  postId: number;
}) {
  const {
    auth: { user },
  } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [commentContent, setCommentContent] = useState("");
  const router = useRouter();
  return (
    <>
      <p style={{ fontSize: "1.2rem" }}>
        {user ? `Comment as ${user.username}` : "Log In To Comment"}
      </p>
      <textarea
        onChange={(event) => setCommentContent(event.target.value)}
        placeholder="Create Comment"
      />
      {user ? (
        <button
          onClick={async () => {
            try {
              await axiosPrivate.post(
                "/api/comment",
                {
                  content: commentContent,
                  postId,
                },
                {
                  headers: { Authorization: `Bearer: ${user.token}` },
                }
              );
              router.refresh();
            } catch (err) {
              // console.log(err);
            }
          }}
        >
          Create Comment
        </button>
      ) : (
        <button style={{ cursor: "not-allowed" }} disabled={true}>
          Create Comment
        </button>
      )}
      {comments.map((el) => (
        <Comment
          key={el.id}
          comment={{
            ...el,
            hasUserDisliked: !!user?.userCommentDislikes.includes(el.id),
            hasUserLilked: !!user?.userCommentLikes.includes(el.id),
          }}
        />
      ))}
    </>
  );
}
