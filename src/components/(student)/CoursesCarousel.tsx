"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "~/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/Card";
import { useEffect, useRef, useState } from "react";
import { Course } from "@prisma/client";
import { Button } from "~/components/ui/Button";
import { Badge } from "../ui/Badge";

const CarouselItem = ({
  className,
  courseId,
  courseName,
  courseCredits,
  courseGrade,
}: {
  className: string;
  courseId: string;
  courseName: string;
  courseCredits: number;
  courseGrade: string;
}) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{courseName}</CardTitle>
        <CardDescription>{courseId}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center text-3xl gap-2">
        
        {courseGrade.length ? (
          courseGrade
        ) : (
          <span className="text-muted-foreground">ungraded</span>
        )}
        <Badge variant="outline">grade</Badge>
      </CardContent>
      <CardFooter className="flex py-0">{courseCredits} credit{courseCredits > 1 ? "s" : ""}</CardFooter>
    </Card>
  );
};

const CarousalIndicator = ({
  selected,
  onClick,
}: {
  selected: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      type="button"
      className={
        "h-[.35rem] w-[.35rem] rounded-full transition-colors duration-200 " +
        (selected ? "bg-foreground" : "bg-muted-foreground")
      }
      onClick={onClick}
    />
  );
};

const Carousel = ({ width, courses }: { width: string; courses: Course[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carousal = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (carousal && carousal.current)
      carousal.current.scrollLeft = carousal.current.offsetWidth * currentIndex;
  }, [currentIndex]);

  const movePrev = () => {
    if (currentIndex > 0) setCurrentIndex((prevState) => prevState - 1);
  };
  const moveNext = () => {
    if (currentIndex < courses.length - 1)
      setCurrentIndex((prevState) => prevState + 1);
  };

  return (
    <div className={cn("relative box-content px-12 pb-4", width)}>
      <div
        className="relative flex w-full touch-pan-x snap-x snap-mandatory overflow-hidden scroll-smooth"
        ref={carousal}
      >
        {courses.map((ele) => (
          <CarouselItem
            className={width}
            courseId={ele.code}
            courseName={ele.name}
            courseCredits={ele.credits}
            courseGrade={ele.grade || ""}
            key={ele.id}
          />
        ))}
      </div>

      <div className="absolute bottom-0 left-1/2 z-30 flex -translate-x-1/2 space-x-3">
        {courses.map((ele, index) => (
          <CarousalIndicator
            selected={index === currentIndex}
            onClick={() => setCurrentIndex(index)}
            key={ele.id}
          />
        ))}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="group absolute left-0 top-1/2 z-30 -translate-y-1/2"
        onClick={movePrev}
      >
        <ChevronLeft />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="group absolute right-0 top-1/2 z-30 -translate-y-1/2"
        onClick={moveNext}
      >
        <ChevronRight />
      </Button>
    </div>
  );
};

export default Carousel;
