import { getServerAuthSession } from "~/server/auth";
import { Role } from "@prisma/client";
import StudentNav from "~/components/(student)/Nav";
import ProfNav from "~/components/(professor)/Nav";
import ThemeToggle from "./ThemeToggle";
import LogoutBtn from "../LogoutBtn";

const Navbar = async () => {
  const session = await getServerAuthSession();
  return (
    <div className="flex items-center justify-between absolute left-0 top-0 right-0">
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
        {session ? <LogoutBtn /> : null}
      </div>
    </div>
  );
};

export default Navbar;
