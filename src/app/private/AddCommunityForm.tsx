"use client";

import type { Dispatch, SetStateAction } from "react";
import styles from "./formStyles.module.css";
import { UploadButton } from "@/util/uploadthing";
import useAuth from "@/hooks/useAuth";

type CommunityInfo = {
  description: string;
  name: string;
  icon: string;
  imageSrc: string;
};

export default function AddCommunityForm({
  communityInfo,
  setCommunityInfo,
}: {
  communityInfo: CommunityInfo;
  setCommunityInfo: Dispatch<SetStateAction<CommunityInfo>>;
}) {
  const { auth } = useAuth();
  return (
    <div className={styles.formContainer}>
      <form className={styles.form}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            value={communityInfo.name}
            onChange={(event) =>
              setCommunityInfo((prev) => {
                return { ...prev, name: event.target.value };
              })
            }
            placeholder="Name your community"
            type="text"
            id="name"
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={communityInfo.description}
            className={styles.desc}
            maxLength={240}
            onChange={(event) =>
              setCommunityInfo((prev) => {
                return { ...prev, description: event.target.value };
              })
            }
            placeholder="Describe your community"
          />
        </div>
        <div>
          <label>Community Icon</label>
          {communityInfo.icon === "" ? (
            <img
              src="https://cdn-icons-png.flaticon.com/512/6939/6939131.png"
              style={{ width: "40px", height: "40px" }}
              alt=""
            />
          ) : (
            <img
              className={styles.communityIcon}
              src={communityInfo.icon}
              alt=""
            />
          )}
          {auth.user ? (
            <UploadButton
              endpoint="iconUploader"
              onClientUploadComplete={(res) => {
                // Do something with the response
                console.log("Files: ", res);
                if (res)
                  setCommunityInfo((prev) => {
                    return { ...prev, icon: res[0].fileUrl };
                  });
                alert("Upload Completed");
              }}
              onUploadError={() => {
                // Do something with the error.
                alert(`Something Went Wrong! Try Again`);
              }}
            />
          ) : (
            <button
              disabled={true}
              style={{
                cursor: "not-allowed",
                width: "144px",
                height: "40px",
                backgroundColor: "#222222",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontFamily: "inherit",
                fontSize: "1rem",
              }}
            >
              Choose File
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
