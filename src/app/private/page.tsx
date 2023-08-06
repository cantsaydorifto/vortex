"use client";
import useAuth from "@/hooks/useAuth";
import "@uploadthing/react/styles.css";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { UploadButton } from "@/util/uploadthing";
import AddCommunityForm from "./AddCommunityForm";
import styles from "./formStyles.module.css";

export default function Home() {
  const { auth } = useAuth();
  // const axiosPrivate = useAxiosPrivate();
  // async function getPrivateData(): Promise<void> {
  //   try {
  //     if (!auth.user) return;
  //     // console.log(auth.user.token);
  //     const res = await axiosPrivate.get<{ users: string[] }>("/api/private", {
  //       headers: { Authorization: `Bearer: ${auth.user.token}` },
  //     });
  //     console.log("res", res.data.users);
  //     // setData(res.data.tokens);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }

  if (!auth.user) return <h1>NOT LOGGED IN</h1>;
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        marginTop: "80px",
      }}
    >
      {/* <button
        style={{ width: "100px", margin: "auto" }}
        onClick={getPrivateData}
      >
        GET DATA
      </button> */}
      <h1 className={styles.heading}>Create Community</h1>
      <div className={styles.container}>
        <AddCommunityForm />
        <div className={styles.imageContainer}>
          <h2>Community Image</h2>
          <img
            src="https://geekflare.com/wp-content/uploads/2022/05/what-is-music-production-1500x999.jpeg"
            alt="aaaa"
          />
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              console.log("Files: ", res);
              alert("Upload Completed");
            }}
            onUploadError={(error: Error) => {
              alert(`ERROR! ${error.message}`);
            }}
          />
        </div>
      </div>
    </main>
  );
}
