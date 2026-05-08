import { Link } from "react-router-dom";
import CourseCard from "./CourseCard";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";

const CoursesSection = () => {
  const { allCourses } = useContext(AppContext);

  return (
    <div className="py-16 lg:px-40 px-8">
      <h2 className="text-3xl font-medium mb-3">Learn from the best.</h2>
      <p className="text-sm md:text-base text-gray-500">
        Discover our top-rated courses across various categories. From coding
        and design to <br /> business and wellness, our courses are crafted to
        deliver results.
      </p>

      <div
        className="courses grid-cols-1 sm:grid-cols-2 md:grid-cols-3
      lg:grid-cols-4 grid gap-3 text-left md:my-16 my-10"
      >
        {allCourses.slice(0, 4).map((course) => {
          return <CourseCard key={course._id} course={course} />;
        })}
      </div>

      <Link
        to={"courses-list"}
        onClick={() => scrollTo(0, 0)}
        className="px-10 py-3 rounded border block w-fit m-auto
      border-gray-500/30 text-gray-500"
      >
        Show all courses
      </Link>
    </div>
  );
};

export default CoursesSection;
