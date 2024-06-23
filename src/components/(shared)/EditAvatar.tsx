"use client";

import { Edit2, Loader2 } from "lucide-react";
import { forwardRef, useState } from "react";
import { cn } from "~/lib/utils";

import { useUploadThing } from "~/hooks/uploadthing";
import { toast } from "~/hooks/use-toast";

import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

const EditAvatar = forwardRef(
  (props: { className: string }, ref: React.ForwardedRef<HTMLLabelElement>) => {
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

    const { startUpload, isUploading } = useUploadThing("profilePicture", {
      onClientUploadComplete: (res) => {
        const file = res ? res[0] : undefined;
        if (file) {
          updateAvatar.mutate({ image: file.url });
        }
      },
      onUploadError: (e) => {
        toast({
          title: "Upload failed",
          description: e.message,
          variant: "destructive",
        });
        console.error(e);
      },
      onUploadBegin: () => {},
    });

    const fileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || !e.target.files.length || !e.target.files[0])
        return;
      const file = e.target.files[0];
      if (file.size > 1024288)
        return toast({
          title: "Alert",
          description: "Max file upload size is 1MB.",
        });
      startUpload([file]);
    };

    return (
      <>
        <input
          id="file"
          accept="image/png, image/jpg, image/jpeg, image/webp, .png, .jpg, .jpeg, .webp"
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
            isUploading ? "cursor-default opacity-50" : "",
          )}
        >
          {isUploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          ) : (
            <Edit2 className="h-8 w-8 text-white" />
          )}
        </label>
      </>
    );
  },
);

export default EditAvatar;
