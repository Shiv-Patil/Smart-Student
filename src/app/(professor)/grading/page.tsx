import { Grade, columns } from "~/components/(professor)/GradeTableColumns";
import { DataTable } from "~/components/(professor)/GradeTable";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/Card";
import { db } from "~/server/db";
import { getServerAuthSession } from "~/server/auth";

async function getData(): Promise<Grade[]> {
  const session = await getServerAuthSession();
  const profCourses = (await db.professor.findFirst({
    where: {
      id: session!.user.professorId!,
    },
  }))!.forCourses.split(",");

  const students = await db.user.findMany({
    where: {
      role: "STUDENT",
    },
    select: {
      name: true,
      email: true,
      student: {
        select: {
          courses: true,
        },
      },
    },
  });
  let data: Grade[] = [];
  students.forEach((ele) => {
    let obj = {
      studentName: ele.name || "",
      studentEmail: ele.email || "",
    };
    ele.student?.courses.forEach((course) => {
      data.push({
        id: course.id,
        grade: course.grade,
        courseCode: course.code,
        courseName: course.name,
        doesTeach: profCourses.includes(course.code),
        ...obj,
      });
    });
  });
  return data;
}

const Grading = async () => {
  const data = await getData();

  return (
    <>
      <Card className="mb-10 mt-24 w-full">
        <CardHeader>
          <CardTitle>Grading</CardTitle>
          <CardDescription>Student list</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col justify-center gap-4">
          <DataTable columns={columns} data={data} />
        </CardContent>
      </Card>
    </>
  );
};

export default Grading;
