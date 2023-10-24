import AuthChoose from "~/components/AuthChoose";
import LogoutBtn from "~/components/LogoutBtn";

import { getServerAuthSession } from "~/server/auth";

export default async function Home() {
  const session = await getServerAuthSession();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      {session ? (
        <div className="flex flex-col items-center gap-2">
          You're logged in as {session.user.name} <br />
          Your role is: {session.user.role}
          <LogoutBtn />
        </div>
      ) : (
        <AuthChoose />
      )}
    </main>
  );
}
