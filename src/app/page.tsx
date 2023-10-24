import Auth from "~/components/(shared)/Auth";
import HomePage from "~/components/(shared)/HomePage";

import { getServerAuthSession } from "~/server/auth";

export default async function Home() {
  const session = await getServerAuthSession();
  return session ? <HomePage /> : <Auth />;
}
