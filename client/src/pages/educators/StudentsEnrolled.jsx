import { useEffect, useState } from "react";
import Loading from "../../components/student/Loading";
import { dummyStudentEnrolled } from "../../assets/assets";

const StudentsEnrolled = () => {
  const [enrolledStudents, setEnrolledStudents] = useState(null);
  const fetchEducatorCourses = () => {
    setEnrolledStudents(dummyStudentEnrolled);
  };

  useEffect(() => {
    fetchEducatorCourses();
  }, []);
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
                <td className="px-4 py-3">{(student.purchaseDate).split("T")[0]}</td>
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
