import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/Table";
import Carousel from "~/components/(student)/CoursesCarousel";

import { api } from "~/trpc/server";
import { Badge } from "~/components/ui/Badge";
import { gradePoints } from "~/lib/utils";

const Academics = async () => {
  const courses = await api.academics.getCourses.query();
  if (!courses.length)
    return (
      <div className="mt-24 items-center justify-center text-muted-foreground">
        No data to display
      </div>
    );
  const totalCredits = courses
    .map((el) => (el.grade ? el.credits : 0))
    .reduce((a, v) => a + v);
  const totalPoints = totalCredits * 10;
  const pointsReceived = courses
    .map((el) => gradePoints(el.grade || "").valueOf() * el.credits)
    .reduce((a, v) => a + v);

  const cgpa = totalPoints
    ? ((pointsReceived / totalPoints) * 10).toFixed(2)
    : 0;
  return (
    <>
      {/* Courses */}
      <Card className="mb-10 mt-24 w-full">
        <CardHeader>
          <CardTitle>Academics</CardTitle>
          <CardDescription>Courses overview</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center gap-4 max-md:flex-col">
          <Carousel
            width="w-[22rem] min-w-[22rem] max-sm:w-[16rem] max-sm:min-w-[16rem]"
            courses={courses}
          />

          <div className="flex flex-col items-center gap-2 text-4xl max-md:flex-row max-sm:flex-col">
            {courses.length} <Badge variant="outline">Total courses</Badge>
            {totalCredits}
            <Badge variant="outline">Total credits</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Grades */}
      <Card className="mb-10 w-full">
        <CardHeader>
          <CardDescription>Grades</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col justify-center gap-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="">Course</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead className="text-right">Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>{course.code}</TableCell>
                  <TableCell>{course.credits}</TableCell>
                  <TableCell>{course.grade || "-"}</TableCell>
                  <TableCell className="text-right">
                    {course.grade
                      ? gradePoints(course.grade) * course.credits
                      : 0}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Reports */}
      <Card className="mb-10 w-full">
        <CardHeader>
          <CardDescription>Reports</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center gap-4 text-3xl max-sm:flex-col">
          <span className="flex flex-1 flex-col items-center gap-4">
            <Badge variant="outline">Maximum points</Badge>
            {totalPoints}
          </span>
          <span className="flex flex-1 flex-col items-center gap-4 text-5xl max-sm:order-3">
            <Badge className="text-center" variant="outline">
              Cumulative grade point average (CGPA)
            </Badge>
            {cgpa}
          </span>
          <span className="flex flex-1 flex-col items-center gap-4">
            <Badge variant="outline">Points received</Badge>
            {pointsReceived}
          </span>
        </CardContent>
      </Card>
    </>
  );
};

export default Academics;
