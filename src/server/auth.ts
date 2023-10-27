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

import { Role } from "@prisma/client";
import newStudentSchema from "~/lib/new-student-schema.json";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: Role;
      studentId?: string;
      professorId?: string;
    } & DefaultSession["user"];
  }
  interface User {
    role: Role;
    image?: string;
    studentId?: string;
    professorId?: string;
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
        const student = await db.student.findFirst({
          where: {id: user.studentId}
        });
        console.warn(user.studentId, student);

        if (!student) {
          user.image = "";

          const createdStudent = await db.student.create(newStudentSchema);
          console.warn(createdStudent.id);
          user.studentId = createdStudent.id;
        }
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
          studentId: user.studentId,
          professorId: user.professorId,
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
