import { useParams } from "react-router-dom";
import SearchBar from "../../components/student/SearchBar";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import CourseCard from "../../components/student/CourseCard";
import { assets } from "../../assets/assets";

const CoursesList = () => {
  const { input } = useParams();
  const { allCourses, navigate } = useContext(AppContext);
  const [filteredCourses, setFilteredCourses] = useState([]);

  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      input
        ? // eslint-disable-next-line react-hooks/set-state-in-effect
          setFilteredCourses(
            allCourses.filter((item) =>
              item.courseTitle.toLowerCase().includes(input.toLowerCase()),
            ),
          )
        : setFilteredCourses(allCourses);
    }
  }, [allCourses, input]);

  return (
    <div className="py-16 lg:px-40 px-8">
      <div className="flex md:flex-row flex-col gap-5 md:justify-between md:items-center">
        <div>
          <h1 className="text-4xl font-semibold text-gray-800">
            Courses List
          </h1>

          <p className="flex gap-1">
            <span
              onClick={() => navigate("/")}
              className="text-blue-600 cursor-pointer"
            >
              Home
            </span>
            / <span>Course List</span>
          </p>
        </div>
        <SearchBar data={input} />
      </div>
      <div
        className={` my-5 ${input ? "flex" : "hidden"}
      border-gray-500/30 text-gray-500 border w-fit px-4 py-2 rounded-sm items-center gap-2`}
      >
        {input}
        <button
          className="cursor-pointer"
          onClick={() => navigate("/courses-list")}
        >
          <img src={assets.cross_icon} alt="cross" />
        </button>
      </div>
      <div
        className="courses grid-cols-1 sm:grid-cols-2 md:grid-cols-3 
      lg:grid-cols-4 grid gap-3 text-left md:my-16 my-10"
      >
        {filteredCourses.map((course) => {
          return <CourseCard key={course._id} course={course} />;
        })}
      </div>
    </div>
  );
};

export default CoursesList;
