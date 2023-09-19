"use client";

import styles from "./page.module.css";
import Community from "@/components/home-community/Community";
import Link from "next/link";
import PostCard from "@/components/PostCard/PostCard";
import CreateCommunity from "@/components/CreateButton/CreateCommunity";
import PopularCommunites from "@/components/popularCommunites/PopularCommunites";
import { useEffect, useState } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import LoadingSkeleton from "./loadingSkeleton";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState(false);
  const [pageData, setPageData] = useState<ResponseData | null>(null);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    async function getCommunityAndPosts() {
      try {
        const res = await axiosPrivate.get<ResponseData>("/api/post");
        setLoading(false);
        setPageData({
          posts: res.data.posts,
          communities: res.data.communities,
        });
      } catch (err) {
        setLoading(false);
        setPageError(true);
      }
    }
    getCommunityAndPosts();
  }, []);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (pageError || !pageData)
    return (
      <main className={styles.content}>
        <h1>Something Went Wrong</h1>
      </main>
    );

  return (
    <div className={styles.content}>
      <Community communities={pageData.communities} />
      <div>
        <div>
          <div>
            <Link href="/post/create" className={styles.createPostLink}>
              <img
                src="https://cdn-icons-png.flaticon.com/512/848/848006.png"
                alt="User"
              />
              <input type="text" placeholder="Create Post" />
            </Link>
            <CreateCommunity />
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
        <PopularCommunites communities={pageData.communities} />
      </div>
    </div>
  );
}

type ResponseData = {
  communities: {
    id: number;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date | null;
    creatorId: number;
    img: string;
    icon: string;
  }[];
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
