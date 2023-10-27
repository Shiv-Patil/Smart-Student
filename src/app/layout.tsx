import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { headers } from "next/headers";

import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "~/components/ui/Toaster";

import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";

import Navbar from "~/components/(shared)/Navbar";
import { Role } from "@prisma/client";
import { ServerThemeProvider } from "@wits/next-themes";

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
  const pathname = headersList.get("x-pathname")!;

  const unprotectedRoutes = ["/"];
  // redirect user to sign in page if they try to go to any other path without being signed in
  // thus we don't have to add a check to every route
  if (!unprotectedRoutes.includes(pathname) && !session) {
    redirect("/");
  }

  const updateAvatarPath = "/profile";
  if (
    session &&
    session.user.role === Role.STUDENT &&
    !session.user.image &&
    pathname !== updateAvatarPath
  ) {
    // student should upload avatar
    redirect(updateAvatarPath);
  }

  // role based access
  if (session) {
    const studentDisallowed = ["/grading"];
    const professorDisallowed = ["/finance", "/academics"];

    if (
      session.user.role === Role.STUDENT &&
      studentDisallowed.includes(pathname)
    )
      redirect("/");
    else if (
      session.user.role === Role.PROFESSOR &&
      professorDisallowed.includes(pathname)
    )
      redirect("/");
  }

  return (
    <ServerThemeProvider attribute="class">
      <html lang="en">
        <body className={`font-sans ${inter.variable}`}>
          <Toaster />
          <TRPCReactProvider headers={headersList}>
            <main className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center px-4">
              <Navbar />
              {children}
            </main>
          </TRPCReactProvider>
        </body>
      </html>
    </ServerThemeProvider>
  );
}
