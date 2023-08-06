"use client";

import { useState } from "react";
import styles from "./formStyles.module.css";
import { UploadButton } from "@/util/uploadthing";

export default function AddCommunityForm() {
  const [desc, setDesc] = useState("");
  return (
    <div className={styles.formContainer}>
      <form className={styles.form}>
        <div>
          <label htmlFor="name">Name</label>
          <input placeholder="Name your community" type="text" id="name" />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={desc}
            className={styles.desc}
            maxLength={250}
            onChange={(event) => setDesc(event.target.value)}
            placeholder="Describe your community"
          />
        </div>
        <div>
          <label>Community Icon</label>
          <img
            className={styles.communityIcon}
            src="https://cdn-icons-png.flaticon.com/512/1099/1099794.png"
            alt=""
          />
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              // Do something with the response
              console.log("Files: ", res);
              alert("Upload Completed");
            }}
            onUploadError={(error: Error) => {
              // Do something with the error.
              alert(`ERROR! ${error.message}`);
            }}
          />
        </div>
      </form>
    </div>
  );
}
