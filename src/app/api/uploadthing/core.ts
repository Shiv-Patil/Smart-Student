import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

import { getServerAuthSession } from "~/server/auth";

export const fileRouter = {
  profilePicture: f({ image: { maxFileSize: "1MB" } })
    .middleware(async () => {
      const session = await getServerAuthSession();
      if (!session) throw new Error("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.url);
    }),
} satisfies FileRouter;

export type fileRouter = typeof fileRouter;
