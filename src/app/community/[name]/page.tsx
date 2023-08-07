import Sidebar from "@/components/sidebar/Sidebar";
import styles from "./communityPage.module.css";
import CommunityInfo from "./CommunityInfo";

export default async function Page({ params }: { params: { name: string } }) {
  console.log(params.name);
  return (
    <main className={styles.container}>
      <Sidebar />
      <div className={styles.comInfoContainer}>
        <CommunityInfo params={params} />
      </div>
    </main>
  );
}
