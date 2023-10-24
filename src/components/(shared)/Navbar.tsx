import { getServerAuthSession } from "~/server/auth";
import { Role } from "@prisma/client";
import StudentNav from "~/components/(student)/Nav";
import ProfNav from "~/components/(professor)/Nav";
import ThemeToggle from "./ThemeToggle";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/Avatar";
import Link from "next/link";

const Navbar = async () => {
  const session = await getServerAuthSession();
  return (
    <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
      <div className="flex flex-1 items-center">
        <ThemeToggle />
      </div>
      {!session ? (
        <h3>Login</h3>
      ) : session.user.role === Role.STUDENT ? (
        <StudentNav />
      ) : (
        <ProfNav />
      )}
      <div className="flex flex-1 items-center justify-end">
        {session ? (
          <Link href="/profile">
            <Avatar>
              <AvatarImage src={session.user.image || ""} />
              <AvatarFallback>?</AvatarFallback>
            </Avatar>
          </Link>
        ) : null}
      </div>
    </div>
  );
};

export default Navbar;
