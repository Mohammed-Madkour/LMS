import { assets, dummyDashboardData } from "../../assets/assets";

const Dashboard = () => {
  return (
    <>
      <div className="flex gap-3 flex-wrap">
        <div className="flex min-w-[230px] gap-2 items-center border-primary border p-3 rounded-md">
          <img src={assets.patients_icon} alt="patients-icon" />
          <div>
            <p className="text-2xl font-medium">
              {dummyDashboardData.enrolledStudentsData.length}
            </p>
            <p className="text-gray-500">Total Enrollments</p>
          </div>
        </div>
        <div className="flex min-w-[230px] gap-2 items-center border-primary border p-3 rounded-md">
          <img src={assets.appointments_icon} alt="appointments-icon" />
          <div>
            <p className="text-2xl font-medium">
              {dummyDashboardData.totalCourses}
            </p>
            <p className="text-gray-500">Total Courses</p>
          </div>
        </div>
        <div className="flex min-w-[230px] gap-2 items-center border-primary border p-3 rounded-md">
          <img src={assets.earning_icon} alt="earning-icon" />
          <div>
            <p className="text-2xl font-medium">
              {dummyDashboardData.totalEarnings}
            </p>
            <p className="text-gray-500">Total Earnings</p>
          </div>
        </div>
      </div>
      {/* Latest Enrollments */}
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
            {dummyDashboardData.enrolledStudentsData.map((student, index) => (
              <tr key={index} className="text-gray-700 border-b border-gray-500/20 text-sm">
                <td className="px-4 py-3 max-sm:hidden">{index + 1}</td>
                <td className="flex max-sm:flex-col max-sm:items-baseline items-center gap-3 py-3 px-4">
                  <img
                    src={student.student.imageUrl}
                    className="w-10 h-10 rounded-full"
                    alt=""
                  />
                  <p className="truncate">{student.student.name}</p>
                </td>
                <td className="px-4 py-3 truncate">{student.courseTitle}</td>
                <td className="px-4 py-3">date</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Dashboard;
