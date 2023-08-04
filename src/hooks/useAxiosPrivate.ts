import { axiosPrivate } from "@/util/axiosPrivate";
import useAuth from "./useAuth";
import { useEffect } from "react";
import useRefresh from "./useRefresh";

type DecodedAccessToken = {
  username: string;
  email: string;
  id: number;
  exp: number;
  iat: number;
};

export default function useAxiosPrivate() {
  const ctx = useAuth();
  const refresh = useRefresh();
  useEffect(() => {
    const reqInterceptor = axiosPrivate.interceptors.request.use(
      async (config) => {
        const token = ctx.auth.user?.token;
        if (token) {
          const decodedToken: DecodedAccessToken = JSON.parse(
            Buffer.from(token.split(".")[1], "base64").toString()
          );
          if (Date.now() - decodedToken.exp * 1000 >= -3000) {
            console.log(Date.now() - decodedToken.exp * 1000);
            const newToken = await refresh();
            console.log("newToken", newToken);
            if (newToken) config.headers.Authorization = `Bearer: ${newToken}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    return () => {
      axiosPrivate.interceptors.request.eject(reqInterceptor);
    };
  }, [ctx.auth.user]);

  return axiosPrivate;
}
