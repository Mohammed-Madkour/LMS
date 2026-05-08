import { Outlet } from "react-router-dom";
import Navbar from "../../components/educator/Navbar";
import SideBar from "../../components/educator/SideBar"
import AddCourse from "./AddCourse";
import Dashboard from "./Dashboard";
import MyCourses from "./MyCourses";
import StudentsEnrolled from "./StudentsEnrolled";

const Educator = () => {
  return (
    <>
      <Navbar />
      <div className="flex">
        <SideBar />
        <div className="flex-1 mt-3 px-4 md:px-10">
          {location.pathname === "/educator" && <Dashboard />}
          {location.pathname === "/educator/add-courses" && <AddCourse />}
          {location.pathname === "/educator/my-courses" && <MyCourses />}
          {location.pathname === "/educator/students-enrolled" && <StudentsEnrolled />}
        </div>
      </div>
    </>
  );
};

export default Educator;
