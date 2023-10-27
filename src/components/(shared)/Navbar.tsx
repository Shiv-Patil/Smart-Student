import { getServerAuthSession } from "~/server/auth";
import { Role } from "@prisma/client";
import StudentNav from "~/components/(student)/Nav";
import ProfNav from "~/components/(professor)/Nav";
import ThemeToggle from "./ThemeToggle";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/Avatar";
import Link from "next/link";
import { User2 } from "lucide-react";

const Navbar = async () => {
  const session = await getServerAuthSession();
  return (
    <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
      <div className="flex flex-1 items-center">
        <ThemeToggle />
      </div>
      {!session ? (
        null
      ) : session.user.role === Role.STUDENT ? (
        !session?.user.image || !session?.user.image.length ? null : (
          <StudentNav />
        )
      ) : (
        <ProfNav />
      )}
      <div className="flex flex-1 items-center justify-end">
        {session ? (
          <Link href="/profile">
            <Avatar className="border-2 border-muted">
              <AvatarImage src={session.user.image || ""} />
              <AvatarFallback>
                <User2 className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </Link>
        ) : null}
      </div>
    </div>
  );
};

export default Navbar;
