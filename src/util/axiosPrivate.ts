import axios from "axios";

export const axiosPrivate = axios.create({
  baseURL: "https://vortexlab.vercel.app",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
