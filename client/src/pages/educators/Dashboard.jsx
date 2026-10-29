import { useContext } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
import Loading from "../../components/student/Loading";

const Dashboard = () => {
  const { backendUrl, isEducator, getToken } = useContext(AppContext);
  const [dashboardData, setDashboardData] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(backendUrl + "/api/educator/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setDashboardData(data.dashboardData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchDashboardData();
    }
  }, [isEducator]);

  return dashboardData ? (
    <>
      <div className="flex gap-3 flex-wrap">
        <div className="flex min-w-[230px] gap-2 items-center border-primary border p-3 rounded-md">
          <img src={assets.patients_icon} alt="patients-icon" />
          <div>
            <p className="text-2xl font-medium">
              {dashboardData.enrolledStudentsData.length}
            </p>
            <p className="text-gray-500">Total Enrollments</p>
          </div>
        </div>
        <div className="flex min-w-[230px] gap-2 items-center border-primary border p-3 rounded-md">
          <img src={assets.appointments_icon} alt="appointments-icon" />
          <div>
            <p className="text-2xl font-medium">{dashboardData.totalCourses}</p>
            <p className="text-gray-500">Total Courses</p>
          </div>
        </div>
        <div className="flex min-w-[230px] gap-2 items-center border-primary border p-3 rounded-md">
          <img src={assets.earning_icon} alt="earning-icon" />
          <div>
            <p className="text-2xl font-medium">
              {dashboardData.totalEarnings}
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
            </tr>
          </thead>
          <tbody>
            {dashboardData.enrolledStudentsData.map((student, index) => (
              <tr
                key={index}
                className="text-gray-700 border-b border-gray-500/20 text-sm"
              >
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

export default Dashboard;
