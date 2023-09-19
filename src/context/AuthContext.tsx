"use client";
import { createContext, useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";

type AuthState = {
  user: {
    username: string;
    email: string;
    token: string;
    userPostLikes: number[];
    userPostDislikes: number[];
    userCommentLikes: number[];
    userCommentDislikes: number[];
  } | null;
  isAuthenticated: boolean;
};

const initAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const initContext: {
  auth: AuthState;
  setAuth: Dispatch<SetStateAction<AuthState>>;
} = {
  auth: initAuthState,
  setAuth: () => {},
};

export const AuthContext = createContext(initContext);

export default function AuthContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [auth, setAuth] = useState(initAuthState);
  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}
