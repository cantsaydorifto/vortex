"use client";
import axios from "axios";
import useAuth from "./useAuth";

export default function useLogout() {
  const ctx = useAuth();

  const logout = async function () {
    try {
      ctx.setAuth(() => {
        return { isAuthenticated: false, user: null };
      });
      await axios.post("/api/clear", { withCredentials: true });
    } catch (err) {
      console.error(err);
    }
  };
  return logout;
}
