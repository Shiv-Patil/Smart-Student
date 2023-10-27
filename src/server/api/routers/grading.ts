import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const grades = ["A", "A-", "B", "B-", "C", "C-", "D", "D-", "E", "RC", "NC"];

export const gradingRouter = createTRPCRouter({
  updateGrades: protectedProcedure
    .input(
      z.object({
        courseId: z.string().min(1).array(),
        newGrade: z
          .string()
          .max(2)
          .refine((str) => !str.length || grades.includes(str), {
            message: "Invalid Grade.",
          }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const profId = ctx.session.user.professorId;
      if (!profId || !profId.length)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Professor Id not in session",
        });
      const prof = await ctx.db.professor.findFirst({
        where: {
          id: profId,
        },
      });
      if (!prof)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Professor not found in database",
        });
      const forCourses = prof.forCourses.split(",");
      return await ctx.db.course.updateMany({
        data: {
          grade: !input.newGrade.length ? null : input.newGrade,
        },
        where: {
          id: { in: input.courseId },
          code: { in: forCourses }
        },
      });
    }),
});
