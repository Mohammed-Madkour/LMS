import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/student/Loading";
import axios from "axios";
import { toast } from "react-toastify";

const MyCourses = () => {
  const { currency, backendUrl, isEducator, getToken } = useContext(AppContext);

  const [courses, setCourses] = useState(null);
  const fetchEducatorCourses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(backendUrl + "/api/educator/courses", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setCourses(data.courses);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchEducatorCourses();
    }
  }, [isEducator]);

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
              <th className="px-4 py-3 font-semibold truncate">Published At</th>
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
                <td className="px-4 py-3 max-sm:hidden">
                  {course.enrolledStudents.length}
                </td>
                <td className="px-4 py-3">
                  {course.createdAt.split("T")[0]}
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
