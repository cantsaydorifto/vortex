"use client";

import Sidebar from "@/components/sidebar/Sidebar";
import styles from "./following.module.css";
import UserInfoContainer from "../UserInfoContainer";
import CommunityDescription from "@/app/community/[name]/CommunityDescription";
import LoadingSkeleton from "./LoadingSkeleton";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Page({ params }: { params: { username: string } }) {
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState(false);
  const [pageData, setPageData] = useState<ResponseData | null>(null);
  useEffect(() => {
    async function getCommunityAndPosts(username: string) {
      try {
        const res = await axios.get<ResponseData>(
          "/api/community/user/" + username
        );
        setLoading(false);
        setPageData({
          userInfo: res.data.userInfo,
          followingCommunities: res.data.followingCommunities,
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
        <Sidebar />
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
        <h2 className={styles.h2}>Communities Joined :</h2>
        <div className={styles.followingContainer}>
          {pageData.followingCommunities.map((el) => (
            <div key={el.Community.id}>
              <CommunityDescription community={el.Community} />
            </div>
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
  followingCommunities: {
    Community: {
      id: number;
      name: string;
      description: string;
      icon: string;
    };
  }[];
};
