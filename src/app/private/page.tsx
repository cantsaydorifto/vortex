"use client";
import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
// import { useState } from "react";

export default function Home() {
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  // console.log(auth.user?.token);
  async function getPrivateData(): Promise<void> {
    try {
      if (!auth.user) return;
      // console.log(auth.user.token);
      const res = await axiosPrivate.get<{ users: string[] }>("/api/private", {
        headers: { Authorization: `Bearer: ${auth.user.token}` },
      });
      console.log("res", res.data.users);
      // setData(res.data.tokens);
    } catch (err) {
      console.error(err);
    }
  }
  // console.log(data);
  if (!auth.user) return <h1>NOT LOGGED IN</h1>;
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        fontSize: "0.8rem",
        gap: "20px",
        marginTop: "50px",
      }}
    >
      <button
        style={{ width: "100px", margin: "auto" }}
        onClick={getPrivateData}
      >
        GET DATA
      </button>
      {/* {data.map((el) => (
        <p key={el.id}>
          {el.id} &rarr; {el.token}
        </p>
      ))} */}
    </main>
  );
}
