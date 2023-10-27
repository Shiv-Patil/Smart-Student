import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const academicsRouter = createTRPCRouter({
  getCourses: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.course.findMany({
      where: {
        studentId: ctx.session.user.studentId,
      },
    });
  }),
});
