import styles from "./page.module.css";
import Sidebar from "@/components/sidebar/Sidebar";
import { Suspense } from "react";
import Loading from "./loadingSkeleton";
import Home from "./Home";

export default function HomePage() {
  return (
    <main className={styles.main}>
      <Sidebar />
      <Suspense fallback={<Loading />}>
        <Home />
      </Suspense>
    </main>
  );
}
