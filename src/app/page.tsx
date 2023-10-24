import Auth from "~/components/(shared)/Auth";
import HomePage from "~/components/(shared)/HomePage";
import Navbar from "~/components/(shared)/Navbar";

import { getServerAuthSession } from "~/server/auth";

export default async function Home() {
  const session = await getServerAuthSession();
  return (
    <main className="flex min-h-screen flex-col items-center p-4">
      <div className="flex w-full max-w-5xl relative">
        <Navbar />
      </div>
      {session ? <HomePage /> : <Auth />}
    </main>
  );
}
