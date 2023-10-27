"use client";

import { Badge } from "~/components/ui/Badge";

const RoleBadge = ({ role }: { role: string }) => {
  return (
    <Badge
      className="cursor-pointer mt-1"
      onClick={() =>
        window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank")
      }
    >
      {role}@bits
    </Badge>
  );
};

export default RoleBadge;
