"use client";
import axios from "axios";
import useAuth from "./useAuth";
import useLogout from "./useLogout";

export default function useRefresh() {
  const { setAuth } = useAuth();
  const logout = useLogout();

  const refresh = async function () {
    try {
      const res = await axios.get<{
        username: string;
        email: string;
        token: string;
        userPostLikes: {
          postId: number;
        }[];
        userPostDislikes: {
          postId: number;
        }[];
        userCommentLikes: {
          commentId: number;
        }[];
        userCommentDislikes: {
          commentId: number;
        }[];
      }>("/api/refresh", { withCredentials: true });

      setAuth({ isAuthenticated: true, user: res.data });
      return res.data.token;
    } catch (err: any) {
      if ([401, 403].includes(err.response.status)) {
        await logout();
      }
    }
  };
  return refresh;
}
