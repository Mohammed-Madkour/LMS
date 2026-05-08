import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/student/Loading";

const MyCourses = () => {
  const { currency, allCourses } = useContext(AppContext);

  const [courses, setCourses] = useState(null);
  const fetchEducatorCourses = () => {
    const coursesWithStatus = allCourses.map((course) => ({
      ...course,
      isLive: true,
    }));
    setCourses(coursesWithStatus);
  };

  useEffect(() => {
    fetchEducatorCourses();
  }, [allCourses]);

  const toggleCourseStatus = (courseId) => {
    setCourses((prev) =>
      prev.map((course) =>
        course._id === courseId
          ? { ...course, isLive: !course.isLive }
          : course,
      ),
    );
  };

  return courses ? (
    <>
      <h1 className="text-2xl text-gray-900 font-medium">My Courses</h1>
      <div className="max-w-4xl border border-gray-500/20 border-b-0 rounded-lg mt-5">
        <table className="table-auto w-full overflow-hidden">
          <thead
            className="text-gray-900 border-b border-gray-500/20 text-sm 
                text-left max-sm:hidden"
          >
            <tr>
              <th className="px-4 py-3 font-semibold truncate">All Courses</th>
              <th className="px-4 py-3 font-semibold truncate">Earnings</th>
              <th className="px-4 py-3 font-semibold truncate">Students</th>
              <th className="px-4 py-3 font-semibold truncate">
                Course Status
              </th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr
                key={course._id}
                className="text-gray-700 border-b border-gray-500/20 text-sm"
              >
                <td className="flex items-center gap-3 py-3 px-4">
                  <img
                    src={course.courseThumbnail}
                    className="w-20 h-10"
                    alt=""
                  />
                  <p className="truncate">{course.courseTitle}</p>
                </td>
                <td className="px-4 py-3">
                  {currency}
                  {Math.floor(
                    course.enrolledStudents.length *
                      ((course.coursePrice * (100 - course.discount)) / 100),
                  )}
                </td>
                <td className="px-4 py-3 max-sm:hidden">{course.enrolledStudents.length}</td>
                <td className="px-4 py-3 flex items-center gap-2">
                  <label>
                    <input
                      className="hidden"
                      type="checkbox"
                      checked={course.isLive}
                      onChange={() => toggleCourseStatus(course._id)}
                    />
                    <div
                      className={`${course.isLive ? "bg-primary" : "bg-gray-200"} w-15 h-7 
                      rounded-full cursor-pointer relative`}
                    >
                      <span
                        className={`bg-white w-5 h-5 rounded-full 
                          absolute top-1 ${course.isLive ? "left-9" : "left-1"}`}
                      ></span>
                    </div>
                  </label>
                  <p className="w-5">{course.isLive ? "Live" : "Private"}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  ) : (
    <Loading />
  );
};

export default MyCourses;
