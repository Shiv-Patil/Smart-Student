import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

import { getServerAuthSession } from "~/server/auth";

const middleware = async () => {
  const session = await getServerAuthSession();
  if (!session) throw new Error("Unauthorized");
  return { userId: session.user.id };
};

export const uploadthingRouter = {
  profilePicture: f({
    image: { maxFileSize: "512KB", maxFileCount: 1 },
  })
    .middleware(middleware)
    .onUploadComplete(async ({ metadata, file }) => {
      return {
        uploadedBy: metadata.userId,
      };
    }),
} satisfies FileRouter;

export type UploadthingRouter = typeof uploadthingRouter;
