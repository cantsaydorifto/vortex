import { authRefreshVerify } from "@/util/authRefreshVerify";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      console.log("user");
      const user = await authRefreshVerify();
      // If you throw, the user will not be able to upload
      if (!user) throw new Error("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id, username: user.username };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for user : ", metadata);

      console.log("file url", file.url);
    }),
  iconUploader: f({ image: { maxFileSize: "512KB" } })
    .middleware(async () => {
      console.log("user");
      const user = await authRefreshVerify();
      if (!user) throw new Error("Unauthorized");

      return { userId: user.id, username: user.username };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("icon Upload complete for user : ", metadata);

      console.log("file url", file.url);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
