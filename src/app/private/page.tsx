"use client";
import useAuth from "@/hooks/useAuth";
import "@uploadthing/react/styles.css";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { UploadButton } from "@/util/uploadthing";
import AddCommunityForm from "./AddCommunityForm";
import styles from "./formStyles.module.css";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { auth } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [communityInfo, setCommunityInfo] = useState({
    description: "",
    name: "",
    icon: "",
    imageSrc: "",
  });
  const [err, setErr] = useState<string | null>(null);
  const axiosPrivate = useAxiosPrivate();
  async function createCommunity() {
    try {
      if (!auth.user) return;
      setLoading(true);
      // console.log(auth.user.token);
      const res = await axiosPrivate.post<{ message: string; name: string }>(
        "/api/community",
        {
          communityName: communityInfo.name,
          description: communityInfo.description,
          icon: communityInfo.icon,
          image: communityInfo.imageSrc,
        },
        {
          headers: { Authorization: `Bearer: ${auth.user.token}` },
        }
      );
      console.log("res", res);
      setLoading(false);
      router.push(`/community/${res.data.name}`);
    } catch (err: any) {
      setTimeout(() => {
        setErr(null);
      }, 3000);
      setLoading(false);
      setErr(err.response.data.message);
      // console.error(err.response.data.message);
    }
  }

  if (!auth.user) return <h1>NOT LOGGED IN</h1>;
  return (
    <main
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        gap: "20px",
        marginTop: "70px",
      }}
    >
      <h1 className={styles.heading}>Create Community</h1>
      {
        <p key={err} className={styles.error}>
          {err || ""}
        </p>
      }
      <div className={styles.container}>
        <AddCommunityForm
          communityInfo={communityInfo}
          setCommunityInfo={setCommunityInfo}
        />
        <div className={styles.imageContainer}>
          <h2>Community Image</h2>
          {communityInfo.imageSrc !== "" ? (
            <img src={communityInfo.imageSrc} alt="aaaa" />
          ) : (
            <div
              style={{
                width: "500px",
                height: "300px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "1px solid grey",
                borderRadius: "12px",
              }}
            >
              <img
                style={{ width: "50px", height: "50px" }}
                src="https://cdn-icons-png.flaticon.com/512/6939/6939131.png"
              />
            </div>
          )}
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              console.log("Files: ", res);
              if (res)
                setCommunityInfo((prev) => {
                  return { ...prev, imageSrc: res[0].fileUrl };
                });
              alert("Upload Completed");
            }}
            onUploadError={(error: Error) => {
              alert(`ERROR! ${error.message}`);
            }}
          />
        </div>
      </div>
      <button
        onClick={createCommunity}
        className={styles.createCommunityButton}
      >
        Create
      </button>
    </main>
  );
}
