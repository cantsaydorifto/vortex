"use client";

import { axiosPrivate } from "@/util/axiosPrivate";
import useAuth from "./useAuth";
import { useEffect } from "react";
import useRefresh from "./useRefresh";
import useLogout from "./useLogout";

export default function useAxiosPrivate() {
  const { auth } = useAuth();
  const refresh = useRefresh();
  const logout = useLogout();
  useEffect(() => {
    const reqInterceptor = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers.Authorization) {
          config.headers.Authorization = `Bearer: ${auth.user?.token}`;
        }
        return config;
      },
      (err) => Promise.reject(err)
    );

    const resInterceptor = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers.Authorization = `Bearer: ${newAccessToken}`;
          console.log("Generated New Access Token");
          return axiosPrivate(prevRequest);
        }
        if (error?.response?.status === 403 && prevRequest.sent) {
          console.log("logout");
          await logout();
        }
        return Promise.reject(error);
      }
    );
    return () => {
      axiosPrivate.interceptors.request.eject(reqInterceptor);
      axiosPrivate.interceptors.response.eject(resInterceptor);
    };
  }, [auth, refresh, logout]);
  return axiosPrivate;
}
