import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { headers } from "next/headers";

import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "~/components/ui/Toaster";

import { getServerAuthSession } from "~/server/auth";
import { permanentRedirect } from "next/navigation";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Smart Student",
  description: "An ERP website example - crux web dev r3 task",
  icons: [{ rel: "icon", url: "/logo.png" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();
  const headersList = headers();
  const pathname = headersList.get("x-pathname");

  const unprotectedRoutes = ["/"];

  // redirect user to sign in page if they try to go to any other path without being signed in
  // thus we don't have to add a check to every route
  if (!unprotectedRoutes.find((val) => val === pathname) && !session) {
    permanentRedirect("/");
  }

  if (session && !session.user.image) {
    // todo: student should upload image
  }

  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${inter.variable}`}>
        <TRPCReactProvider headers={headersList}>{children}</TRPCReactProvider>
        <Toaster />
      </body>
    </html>
  );
}
