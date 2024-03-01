import AuthContextProvider from "@/context/AuthContext";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import LoginProvider from "@/components/LoginProvider";
import Navbar from "@/components/Navbar/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vortex",
  description:
    "Vortex is a social media platform for communities. Join us and connect with people who share your interests!",
  icons: "/assets/logo3.png",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContextProvider>
          <LoginProvider>
            <Navbar />
            {children}
          </LoginProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
