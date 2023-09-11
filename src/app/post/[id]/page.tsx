import Sidebar from "@/components/sidebar/Sidebar";
import styles from "./postPage.module.css";
import PostCard from "@/components/PostCard/PostCard";
import { authRefreshVerify } from "@/util/authRefreshVerify";
import prisma from "@/util/prisma";
import Comments from "./Comments";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getCommunityAndPosts(postId: number) {
  let userId: number | null = null;
  console.log(postId);
  try {
    const user = await authRefreshVerify();
    userId = user.id;
  } catch (err) {
    // console.log(err);
  }
  try {
    await wait(100000);
    const [postRes, commentRes] = await prisma.$transaction([
      prisma.post.findUnique({
        where: { id: postId },
        include: {
          author: {
            select: {
              username: true,
            },
          },
          Likes: { select: { userId: true } },
          DisLikes: { select: { userId: true } },
        },
      }),
      prisma.comment.findMany({
        where: {
          postId,
        },
        include: {
          author: {
            select: {
              username: true,
            },
          },
          CommentLike: { select: { userId: true } },
          CommentDisLike: { select: { userId: true } },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

    const [post, comments] = [
      postRes
        ? {
            ...postRes,
            Likes: postRes.Likes.length,
            DisLikes: postRes.DisLikes.length,
            hasUserLiked: postRes.Likes.includes({ userId: userId! }),
            hasUserDisLiked: postRes.DisLikes.includes({ userId: userId! }),
          }
        : null,
      commentRes.map((el) => ({
        ...el,
        CommentLike: el.CommentLike.length,
        CommentDisLike: el.CommentDisLike.length,
        hasUserLilked: el.CommentLike.includes({ userId: userId! }),
        hasUserDisliked: el.CommentDisLike.includes({ userId: userId! }),
      })),
    ];
    return {
      post,
      comments,
      postId,
    };
  } catch (err) {
    console.log(err);
  }
}

export default async function Page({ params }: { params: { id: string } }) {
  if (isNaN(params.id as any)) {
    return (
      <main>
        <h1>Invalid Id</h1>
      </main>
    );
  }
  const res = await getCommunityAndPosts(Number(params.id));
  if (!res) return; //RETURN SOME ERROR
  return (
    <main className={styles.container}>
      <Sidebar />
      <div className={styles.commentContainer}>
        <PostCard
          like={res.post?.hasUserLiked}
          dislike={res.post?.hasUserDisLiked}
          post={res.post}
          postPage={true}
        />
        <Comments postId={res.postId} comments={res.comments} />
      </div>
    </main>
  );
}
