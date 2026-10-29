import { useEffect, useState } from "react";
import Loading from "../../components/student/Loading";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const StudentsEnrolled = () => {
  const { backendUrl, isEducator, getToken } = useContext(AppContext);

  const [enrolledStudents, setEnrolledStudents] = useState(null);
  const fetchEducatorCourses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(
        backendUrl + "/api/educator/enrolled-students",
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (data.success) {
        setEnrolledStudents(data.enrolledStudents);
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
  return enrolledStudents ? (
    <>
      <h2 className="text-2xl text-gray-900 mt-10 font-medium">
        Latest Enrollments
      </h2>
      <div className="max-w-4xl border border-gray-500/20 border-b-0 rounded-lg mt-5">
        <table className="table-auto w-full overflow-hidden">
          <thead
            className="text-gray-900 border-b border-gray-500/20 text-sm 
          text-left max-sm:hidden"
          >
            <tr>
              <th className="px-4 py-3 font-semibold truncate">#</th>
              <th className="px-4 py-3 font-semibold truncate">Student Name</th>
              <th className="px-4 py-3 font-semibold truncate">Course Title</th>
              <th className="px-4 py-3 font-semibold truncate">Date</th>
            </tr>
          </thead>
          <tbody>
            {enrolledStudents.map((student, index) => (
              <tr
                key={index}
                className="text-gray-700 border-b border-gray-500/20 text-sm"
              >
                <td className="px-4 py-3">{index + 1}</td>
                <td className="flex max-sm:flex-col max-sm:items-baseline items-center gap-3 py-3 px-4">
                  <img
                    src={student.student.imageUrl}
                    className="w-10 h-10 rounded-full"
                    alt=""
                  />
                  <p>{student.student.name}</p>
                </td>
                <td className="px-4 py-3">{student.courseTitle}</td>
                <td className="px-4 py-3">
                  {student.purchaseDate.split("T")[0]}
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

export default StudentsEnrolled;
