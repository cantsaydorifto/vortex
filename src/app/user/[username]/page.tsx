"use client";

import Sidebar from "@/components/sidebar/Sidebar";
import styles from "./userPage.module.css";
import UserInfoContainer from "./UserInfoContainer";
import PostCard from "@/components/PostCard/PostCard";
import { useEffect, useState } from "react";
import axios from "axios";
import LoadingSkeleton from "./LoadingSkeleton";

export default function Page({ params }: { params: { username: string } }) {
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState(false);
  const [pageData, setPageData] = useState<ResponseData | null>(null);
  useEffect(() => {
    async function getCommunityAndPosts(username: string) {
      try {
        const res = await axios.get<ResponseData>("/api/user/" + username);
        setLoading(false);
        setPageData({
          posts: res.data.posts,
          userInfo: res.data.userInfo,
        });
      } catch (err) {
        setLoading(false);
        setPageError(true);
      }
    }
    getCommunityAndPosts(params.username);
  }, [params.username]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (pageError || !pageData)
    return (
      <main className={styles.container}>
        <div className={styles.pageContainer}>
          <h1>Something Went Wrong</h1>
        </div>
      </main>
    );

  return (
    <main className={styles.container}>
      <Sidebar />
      <div className={styles.pageContainer}>
        <UserInfoContainer userInfo={pageData.userInfo} />
        <div className={styles.postContainer}>
          {pageData.posts.map((post) => (
            <PostCard
              post={post}
              postPage={false}
              key={post.id}
              showPost={true}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

type ResponseData = {
  userInfo: {
    username: string;
    joiningDate: Date;
    userId: number;
    following: number;
    followers: number;
    userProfilePic: string;
  };
  posts: {
    Likes: number;
    DisLikes: number;
    Comment: number;
    Community: {
      id: number;
      name: string;
      icon: string;
    };
    author: {
      username: string;
    };
    id: number;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date | null;
    authorId: number;
    communityId: number;
  }[];
};
