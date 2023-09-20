import axios from "axios";
export const axiosPrivate = axios.create({
  baseURL: process.env.BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
