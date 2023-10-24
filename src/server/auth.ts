import { PrismaAdapter } from "@next-auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

import { env } from "~/env.mjs";
import { db } from "~/server/db";

import { Role, Course, User } from "@prisma/client";
import testProfs from "../../professors.json";

interface Prof {
  name: string;
  forCourses: string;
  password: string;
}

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
  },
  callbacks: {
    signIn: async ({ user, account, profile, email }) => {
      if (account?.provider === "google") {
        // student login (account)
        user.role = Role.STUDENT;
      } else {
        // prof login (email)
        user.role = Role.PROFESSOR;
      }
      return true;
    },
    session: ({ session, user }) => {
      console.log("getting session");
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
  ],
};

export const getServerAuthSession = () => getServerSession(authOptions);
