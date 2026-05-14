import { useEffect, useState } from "react";
import { AppContext } from "./AppContext";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import { useAuth, useUser } from "@clerk/clerk-react";

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  const [allCourses, setAllCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  const { getToken } = useAuth();
  const { user } = useUser();

  // Fetch All Courses
  const fetchCourses = async () => {
    setAllCourses(dummyCourses);
  };

  // Fetch Enrolled Courses
  const fetchEnrolledCourses = async () => {
    setEnrolledCourses(dummyCourses);
  };

  // Calculate Average Rating
  const calculateRating = (course) => {
    if (course.courseRatings.length === 0) return 0;
    let totalRating = 0;
    course.courseRatings.forEach((rating) => {
      totalRating += rating.rating;
    });
    return totalRating / course.courseRatings.length;
  };

  // Calculate Chapter time
  const calculateChapterTime = (chapter) => {
    let time = 0;
    chapter.chapterContent.map((lecture) => (time += lecture.lectureDuration));
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  // Calculate Course Duration
  const calculateCourseTime = (course) => {
    let time = 0;
    course.courseContent.map((chapter) =>
      chapter.chapterContent.map(
        (lecture) => (time += lecture.lectureDuration),
      ),
    );
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  // Calculate Number Of Lectures In The Course
  const calculateNumberOfLectures = (course) => {
    let totalLectures = 0;
    course.courseContent.map((chapter) => {
      if (Array.isArray(chapter.chapterContent)) {
        return (totalLectures += chapter.chapterContent.length);
      }
    });

    return totalLectures;
  };

  useEffect(() => {
    fetchCourses();
    fetchEnrolledCourses();
  }, []);

  const logToken = async () => {
    console.log(await getToken());
  };

  useEffect(() => {
    if (user) {
      logToken();
    }
  }, [user]);

  let value = {
    currency,
    allCourses,
    navigate,
    calculateRating,
    calculateChapterTime,
    calculateCourseTime,
    calculateNumberOfLectures,
    enrolledCourses,
    setEnrolledCourses,
  };

  return <AppContext value={value}>{children}</AppContext>;
};
