"use client";

import { Edit2, Loader2 } from "lucide-react";
import { forwardRef, useState } from "react";
import { cn } from "~/lib/utils";

import { useUploadThing } from "~/hooks/uploadthing";
import { toast } from "~/hooks/use-toast";
import { UploadFileResponse } from "uploadthing/client";

import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

const EditAvatar = forwardRef(
  (props: { className: string }, ref: React.ForwardedRef<HTMLLabelElement>) => {
    const [isUploading, setIsUploading] = useState(false);
    const router = useRouter();
    const updateAvatar = api.profile.updateAvatar.useMutation({
      onSuccess: () => {
        toast({ title: "Uploaded successfully" });
        router.refresh();
      },
      onError: (e) => {
        toast({ title: "Error updating avatar", variant: "destructive" });
        console.error(e);
      },
    });

    const { startUpload } = useUploadThing("profilePicture", {
      onClientUploadComplete: (res: UploadFileResponse[] | undefined) => {
        const file = res ? res[0] : undefined;
        if (file) {
          updateAvatar.mutate({ image: file.url });
        }
        setIsUploading(false);
      },
      onUploadError: (e) => {
        toast({
          title: "Upload failed",
          description: e.message,
          variant: "destructive",
        });
        setIsUploading(false);
        console.error(e);
      },
      onUploadBegin: () => {
        setIsUploading(true);
      },
    });

    const fileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || !e.target.files.length || !e.target.files[0])
        return;
      setIsUploading(true);
      const file = e.target.files[0];
      startUpload([file]);
    };

    return (
      <>
        <input
          id="file"
          className="hidden"
          type="file"
          onChange={fileSelected}
          disabled={isUploading}
        />
        <label
          htmlFor="file"
          ref={ref}
          className={cn(
            "flex cursor-pointer items-center justify-center",
            props.className,
            isUploading ? "opacity-50" : "",
          )}
        >
          {isUploading ? (
            <Loader2 className="h-8 w-8 animate-spin" />
          ) : (
            <Edit2 className="h-8 w-8" />
          )}
        </label>
      </>
    );
  },
);

export default EditAvatar;
