"use client";
import { useState } from "react";
import styles from "./page.module.css";
import useAuth from "@/hooks/useAuth";
import axios from "axios";

export default function Home() {
  const [userInfo, setUserInfo] = useState({
    username: "",
    password: "",
    email: "",
  });

  const [login, setLogin] = useState(true);
  const [error, setError] = useState(false);
  const { auth, setAuth } = useAuth();
  // console.log(auth);

  async function handleAuth(userInfo: {
    username: string;
    email?: string;
    password: string;
  }) {
    try {
      const res = await axios.post<{
        username: string;
        email: string;
        token: string;
      }>("/api/login", {
        username: userInfo.username,
        password: userInfo.password,
      });
      setAuth({ isAuthenticated: true, user: res.data });
      console.log(res);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      setError(err.response.data.message);
    }
  }

  return (
    <main className={styles.main}>
      {auth.user ? (
        <h1>Logged in as {auth.user.username}</h1>
      ) : (
        <h1>Not Logged In</h1>
      )}
      <h1 onClick={() => setLogin((prev) => !prev)}>
        {login ? "LOGIN" : "SIGNUP"}
      </h1>
      <form>
        <label htmlFor="username">Username</label>
        <input
          onChange={(event) =>
            setUserInfo((prev) => {
              return { ...prev, username: event.target.value };
            })
          }
          type="text"
          name="username"
          id="username"
        />
        {!login && (
          <>
            <label htmlFor="email">Email</label>
            <input
              onChange={(event) =>
                setUserInfo((prev) => {
                  return { ...prev, email: event.target.value };
                })
              }
              type="email"
              name="email"
              id="email"
            />
          </>
        )}
        <label htmlFor="password">Password</label>
        <input
          onChange={(event) =>
            setUserInfo((prev) => {
              return { ...prev, password: event.target.value };
            })
          }
          type="password"
          name="password"
          id="password"
        />
        <button
          onClick={async (event) => {
            event.preventDefault();
            await handleAuth(userInfo);
          }}
        >
          Signup
        </button>
        {error && <p>{error}</p>}
      </form>
      <button>interceptor</button>
    </main>
  );
}
