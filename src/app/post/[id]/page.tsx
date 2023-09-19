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
  // console.log(postId);
  try {
    const user = await authRefreshVerify();
    userId = user.id;
  } catch (err) {
    // console.log(err);
  }
  try {
    await wait(1000);
    const [postRes, commentRes] = await prisma.$transaction([
      prisma.vortex_Post.findUnique({
        where: { id: postId },
        include: {
          author: {
            select: {
              username: true,
            },
          },
          Community: {
            select: {
              id: true,
              icon: true,
              name: true,
            },
          },
          Likes: { select: { userId: true } },
          DisLikes: { select: { userId: true } },
          Comment: { select: { postId: true } },
        },
      }),
      prisma.vortex_Comment.findMany({
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

    if (!postRes) return null;

    const postLikes = postRes.Likes.map((el) => el.userId);
    const postDislikes = postRes.DisLikes.map((el) => el.userId);
    const commentRes2 = commentRes.map((el) => ({
      ...el,
      CommentLike: el.CommentLike.map((el) => el.userId),
      CommentDisLike: el.CommentDisLike.map((el) => el.userId),
    }));

    const [post, comments] = [
      postRes
        ? {
            ...postRes,
            Likes: postRes.Likes.length,
            DisLikes: postRes.DisLikes.length,
            Comment: postRes.Comment.length,
            hasUserLiked: postLikes.includes(userId!),
            hasUserDisLiked: postDislikes.includes(userId!),
          }
        : null,
      commentRes2.map((el) => ({
        ...el,
        CommentLike: el.CommentLike.length,
        CommentDisLike: el.CommentDisLike.length,
        hasUserLilked: el.CommentLike.includes(userId!),
        hasUserDisliked: el.CommentDisLike.includes(userId!),
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
          showPost={true}
        />
        <Comments postId={res.postId} comments={res.comments} />
      </div>
    </main>
  );
}
