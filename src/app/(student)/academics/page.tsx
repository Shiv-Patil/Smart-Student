import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/Card";
import Carousel from "~/components/(student)/CoursesCarousel";

import { api } from "~/trpc/server";
import { Badge } from "~/components/ui/Badge";

const Academics = async () => {
  const courses = await api.academics.getCourses.query()
  return (
    <>
      <Card className="mt-24 w-full">
        <CardHeader>
          <CardTitle>Academics</CardTitle>
          <CardDescription>Courses overview</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center gap-4">
          <Carousel width="w-[22rem] min-w-[22rem]" courses={courses} />

          <div className="flex flex-col items-center gap-2 text-4xl">
            {courses.length} <Badge variant="outline">Total courses</Badge>
            {courses.map((el => el.credits)).reduce((a, v) => a+v)} <Badge variant="outline">Total credits</Badge>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default Academics;
