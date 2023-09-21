"use client";
import { useEffect, useState } from "react";
import styles from "./create.module.css";
import axios from "axios";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

type Post = {
  title: string;
  content: string;
};

type DebounceFunction = (...p: any[]) => any;

function debounce(fn: DebounceFunction, t: number): DebounceFunction {
  let timeout: ReturnType<typeof setTimeout>;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn(...args);
    }, t);
  };
}

export default function CreatePost() {
  const token = useAuth().auth.user?.token;
  const axiosPrivate = useAxiosPrivate();

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [doc, setDoc] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [community, setCommunity] = useState<{
    name: string;
    id: number;
    icon: string;
  } | null>(null);

  const [postInfo, setPostInfo] = useState<Post>({
    content: "",
    title: "",
  });

  const [results, setResults] = useState<
    { name: string; id: number; icon: string }[]
  >([]);

  useEffect(() => {
    setDoc(true);
  }, []);

  const handleInputChange = debounce(async (value) => {
    try {
      if (value === "") {
        setResults([]);
        return;
      }
      const res = await axios.get<{
        results: { name: string; id: number; icon: string }[];
      }>(`/api/community/search?query=${value}`);
      setResults(res.data.results);
    } catch (err) {
      console.log(err);
    }
  }, 300);
  return (
    <main className={styles.main}>
      <div>
        <h1>Create a post</h1>
        <form className={styles.form}>
          <div>
            <span>Community : </span>
            {community ? (
              <div key={community.id}>
                <img src={community.icon} alt={community.name} />
                <span style={{ fontSize: "1rem" }}>{community.name}</span>
              </div>
            ) : (
              <div
                style={{
                  border: "none",
                  backgroundColor: "transparent",
                  color: "grey",
                  height: "48px",
                }}
              >
                Select a community
              </div>
            )}
            <div key={JSON.stringify(results)}>
              {results.length === 0 &&
                doc &&
                (
                  document.querySelector(
                    "#communitySelectInput"
                  ) as HTMLInputElement
                ).value !== "" && (
                  <div
                    style={{
                      padding: "10px",
                      height: "40px",
                      minWidth: "200px",
                    }}
                  >
                    No results
                  </div>
                )}
              {results.map((el) => (
                <div
                  onClick={() => {
                    setCommunity(el);
                    setResults([]);
                    (
                      document.querySelector(
                        "#communitySelectInput"
                      ) as HTMLInputElement
                    ).value = "";
                  }}
                  className={styles.result}
                  key={el.id}
                >
                  <img src={el.icon} alt={el.name} />
                  <span>{el.name[0].toUpperCase() + el.name.slice(1)}</span>
                </div>
              ))}
            </div>
          </div>
          <input
            id="communitySelectInput"
            autoComplete="off"
            onChange={(ev) => handleInputChange(ev.target.value)}
            placeholder="Search"
            type="text"
          />
          <div>
            <label htmlFor="title">Title</label>
            <input
              value={postInfo.title}
              autoComplete="off"
              onChange={(event) =>
                setPostInfo((prev) => {
                  return { ...prev, title: event.target.value };
                })
              }
              placeholder="Post something!"
              type="text"
              id="title"
            />
          </div>
          <div>
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              value={postInfo.content}
              className={styles.desc}
              maxLength={500}
              onChange={(event) =>
                setPostInfo((prev) => {
                  return { ...prev, content: event.target.value };
                })
              }
              placeholder="Describe your post"
            />
          </div>
        </form>
        {token ? (
          <button
            disabled={loading}
            onClick={async () => {
              try {
                setLoading(true);
                const postBody = {
                  title: postInfo.title,
                  content: postInfo.content,
                  communityId: community?.id,
                };
                await axiosPrivate.post("/api/post", postBody, {
                  headers: { Authorization: `Bearer: ${token}` },
                });
                setLoading(false);
                router.push(`/community/${community!.name}`);
              } catch (err: any) {
                setTimeout(() => {
                  setErr(null);
                }, 3000);
                setLoading(false);
                setErr(err.response.data.message);
              }
            }}
          >
            Create Post
          </button>
        ) : (
          <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
            <span style={{ color: "grey" }}>Log in to Post</span>
            <button
              style={{
                cursor: "not-allowed",
                backgroundColor: "rgb(62, 62, 143)",
              }}
              disabled={true}
            >
              Create Post
            </button>
          </div>
        )}
        {err && (
          <p key={err} className={styles.error}>
            {err}
          </p>
        )}
      </div>
      <div className={styles.rules}>
        <div className={styles.headingContainer}>
          <img
            src="https://cdn-icons-png.flaticon.com/512/931/931949.png"
            alt=""
          />
          <h2>Rules: </h2>
        </div>
        <hr />
        <ol>
          <li>Be Respectful and Kind</li>
          <hr />
          <li>Stay On-Topic:</li>
          <hr />
          <li>Follow Community Guidelines</li>
          <hr />
          <li>Support New Members</li>
        </ol>
      </div>
    </main>
  );
}
