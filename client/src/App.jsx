import { Routes, Route, useMatch } from "react-router-dom";
import Home from "./pages/students/Home";
import CoursesList from "./pages/students/CoursesList";
import CourseDetails from "./pages/students/CourseDetails";
import MyEnrollments from "./pages/students/MyEnrollments";
import Player from "./pages/students/Player";
import Educator from "./pages/educators/Educator";
import Loading from "./components/student/Loading";
import Dashboard from "./pages/educators/Dashboard";
import AddCourse from "./pages/educators/AddCourse";
import StudentsEnrolled from "./pages/educators/StudentsEnrolled";
import MyCourses from "./pages/educators/MyCourses";
import Navbar from "./components/student/Navbar";
import Footer from "./components/student/Footer";
import "quill/dist/quill.snow.css";
import { ToastContainer } from "react-toastify";

function App() {
  const isEducator = useMatch("/educator/*");
  return (
    <>
      {!isEducator && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses-list" element={<CoursesList />} />
        <Route path="/courses-list/:input" element={<CoursesList />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/my-enrollments" element={<MyEnrollments />} />
        <Route path="/player/:courseId" element={<Player />} />
        <Route path="/loading/:path" element={<Loading />} />
        <Route path="/educator" element={<Educator />}>
          <Route path="educator" element={<Dashboard />} />
          <Route path="add-courses" element={<AddCourse />} />
          <Route path="students-enrolled" element={<StudentsEnrolled />} />
          <Route path="my-courses" element={<MyCourses />} />
        </Route>
      </Routes>
      {!isEducator && <Footer />}
      <ToastContainer />
    </>
  );
}

export default App;
