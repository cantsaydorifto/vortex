// "use client"

import styles from "./page.module.css";
import Sidebar from "@/components/sidebar/Sidebar";
import Home from "./Home";

export default function HomePage() {
  return (
    <main className={styles.main}>
      <Sidebar />
      <Home />
    </main>
  );
}
