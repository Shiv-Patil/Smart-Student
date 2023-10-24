import { PrismaAdapter } from "@next-auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";

import { env } from "~/env.mjs";
import { db } from "~/server/db";

import { Role, Course, User } from "@prisma/client";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: Role;
      courses: Course[];
      forCourses?: string;
    } & DefaultSession["user"];
  }
  interface User {
    role: Role;
    courses: Course[];
    forCourses?: string;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  pages: {
    signIn: "/",
    signOut: "/profile",
    error: "/",
    verifyRequest: "/?verifyRequest",
    newUser: "/"
  },
  callbacks: {
    signIn: async ({ user, account }) => {
      if (account?.provider === "google") {
        // student login (account)
        user.role = Role.STUDENT;
      } else {
        // prof login (email)
        user.role = Role.PROFESSOR;

        const userExists = await db.user.findFirst({
          where: { email: user.email || "" },
        });

        if (!userExists) return false;
      }
      return true;
    },
    session: ({ session, user }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          role: user.role,
          courses: user.courses,
          forCourses: user.forCourses,
        },
      };
    },
  },
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
};

export const getServerAuthSession = () => getServerSession(authOptions);
