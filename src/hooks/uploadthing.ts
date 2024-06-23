import { generateReactHelpers } from "@uploadthing/react";

import type { UploadthingRouter } from "~/app/api/uploadthing/core";

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<UploadthingRouter>();
