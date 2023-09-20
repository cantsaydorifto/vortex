"use client";

import Sidebar from "@/components/sidebar/Sidebar";
import styles from "./postPage.module.css";
import PostCard from "@/components/PostCard/PostCard";
import Comments from "./Comments";
import type { vortex_Post as Post } from "@prisma/client";
import { useEffect, useState } from "react";
import LoadingSkeleton from "./loadingSkeleton";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useAuth from "@/hooks/useAuth";

export default function Page({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState(false);
  const [pageData, setPageData] = useState<ResponseData | null>(null);
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();

  useEffect(() => {
    if (isNaN(params.id as any)) {
      setPageError(true);
    }
    async function getCommunityAndPosts(postId: number) {
      try {
        const res = await axiosPrivate.get<ResponseData>("/api/post/" + postId);
        setLoading(false);
        setPageData({
          post: res.data.post,
          comments: res.data.comments,
          postId,
        });
      } catch (err) {
        setLoading(false);
        setPageError(true);
      }
    }
    getCommunityAndPosts(Number(params.id));
  }, [params.id]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (pageError || !pageData)
    return (
      <main className={styles.container}>
        <div className={styles.commentContainer}>
          <h1>Something Went Wrong</h1>
        </div>
      </main>
    );

  return (
    <main className={styles.container}>
      <Sidebar />
      <div className={styles.commentContainer}>
        <PostCard post={pageData.post} postPage={true} showPost={true} />
        <Comments postId={pageData.postId} comments={pageData.comments} />
      </div>
    </main>
  );
}

type ResponseData = {
  post: ResponsePost;
  comments: ResponseComment[];
  postId: number;
};

type ResponsePost = Post & {
  Likes: number;
  DisLikes: number;
  Comment: number;
  Community: {
    id: number;
    name: string;
    icon: string;
  };
  author: { username: string };
  // hasUserLiked?: boolean;
  // hasUserDisLiked?: boolean;
};

type ResponseComment = {
  CommentLike: number;
  CommentDisLike: number;
  // hasUserLilked: boolean;
  // hasUserDisliked: boolean;
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
