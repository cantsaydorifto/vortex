"use client";

import Sidebar from "@/components/sidebar/Sidebar";
import styles from "./communityPage.module.css";
import CommunityInfo from "./CommunityInfo";
import PostCard from "@/components/PostCard/PostCard";
import CommunityDescription from "./CommunityDescription";
import CreatePost from "@/components/CreateButton/CreatePost";
import { useEffect, useState } from "react";
import LoadingSkeleton from "./loadingSekeleton";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

export default function Page({ params }: { params: { name: string } }) {
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState(false);
  const [pageData, setPageData] = useState<ResponseData | null>(null);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    async function getCommunityAndPosts(communityName: string) {
      try {
        const res = await axiosPrivate.get<ResponseData>(
          "/api/post/community/" + communityName
        );
        setLoading(false);
        setPageData({
          posts: res.data.posts,
          community: res.data.community,
          following: res.data.following,
        });
      } catch (err) {
        setLoading(false);
        setPageError(true);
      }
    }
    getCommunityAndPosts(params.name);
  }, []);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (pageError || !pageData || !pageData.community)
    return (
      <main className={styles.container}>
        <Sidebar />
        <div className={styles.comInfoContainer}>
          <div className={styles.postContainer}>
            <h1>Something Went Wrong</h1>
          </div>
        </div>
      </main>
    );
  return (
    <main className={styles.container}>
      <Sidebar />
      <div className={styles.comInfoContainer}>
        <div className={styles.postContainer}>
          <div>
            <CommunityDescription
              community={pageData.community}
              following={pageData.following}
            />
            <CreatePost />
          </div>
          {pageData.posts.map((post) => (
            <PostCard
              postPage={false}
              showPost={false}
              key={post.id}
              post={post}
            />
          ))}
        </div>
        <CommunityInfo
          following={pageData.following.includes(pageData.community.id)}
          res={pageData.community}
        />
      </div>
    </main>
  );
}

type ResponseData = {
  community: {
    id: number;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date | null;
    creatorId: number;
    img: string;
    icon: string;
  } | null;
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
  following: number[];
};
