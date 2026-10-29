import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import Loading from "../../components/student/Loading";
import humanizeDuration from "humanize-duration";
import YouTube from "react-youtube";
import axios from "axios";
import { toast } from "react-toastify";

const CourseDetails = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const { id } = useParams();

  const [courseDetails, setCourseDetails] = useState(null);
  const [openSection, setOpenSection] = useState({});
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [playerData, setPlayerData] = useState(null);

  const {
    calculateRating,
    calculateChapterTime,
    calculateCourseTime,
    calculateNumberOfLectures,
    backendUrl,
    userData,
    getToken,
  } = useContext(AppContext);

  const fetchCourseDetails = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/courses/" + id);
      if (data.success) {
        setCourseDetails(data.course);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const enrollCourse = async () => {
    if (!userData) {
      return toast.warn("Login to Enroll");
    }
    if (isEnrolled) {
      return toast.warn("User Already is Enrolled in This Course");
    }

    try {
      const token = await getToken();
      const { data } = await axios.post(
        backendUrl + "/api/user/purchase",
        {
          courseId: courseDetails._id,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (data.success) {
        const { session_url } = data;
        window.location.replace(session_url);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchCourseDetails();
  }, []);

  useEffect(() => {
    if (userData && courseDetails) {
      setIsEnrolled(userData.enrolledCourses.includes(courseDetails._id));
    }
  }, [userData, courseDetails]);

  const toggleSection = (index) => {
    setOpenSection((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return courseDetails ? (
    <div
      className="flex md:flex-row flex-col-reverse md:items-start items-center lg:px-40 px-8
    py-16 md:justify-between gap-16 relative"
    >
      <div
        className="absolute w-full h-[500px] 
      bg-linear-to-b from-cyan-100/70 left-0 top-0 -z-1"
      ></div>
      {/* left column */}
      <div className="md:max-w-xl w-full z-10">
        <div className="flex flex-col gap-3">
          <h1
            className="md:text-(length:--course-details-heading-large) 
        text-(length:--course-details-heading-small) text-gray-800 font-semibold"
          >
            {courseDetails.courseTitle}
          </h1>
          <p
            className="text-gray-500 md:text-base text-sm"
            dangerouslySetInnerHTML={{
              __html: courseDetails.courseDescription.slice(0, 200),
            }}
          ></p>
          <div className="flex gap-1 items-center max-sm:flex-wrap">
            <p>{calculateRating(courseDetails)}</p>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <img
                  key={i}
                  className="w-3.5 h-3.5"
                  src={
                    i < Math.floor(calculateRating(courseDetails))
                      ? assets.star
                      : assets.star_blank
                  }
                  alt="star"
                ></img>
              ))}
            </div>
            <p className="text-blue-500">
              ({courseDetails.courseRatings.length}){" "}
              {courseDetails.courseRatings.length > 1 ? "ratings" : "rating"}
            </p>
            <p>
              {courseDetails.enrolledStudents.length}{" "}
              {courseDetails.enrolledStudents.length > 1
                ? "students"
                : "student"}
            </p>
          </div>
          <p>
            Course by{" "}
            <span className="text-blue-600 underline">
              {courseDetails.educator.name}
            </span>
          </p>
        </div>

        <div className="mt-16">
          <h2 className=" text-2xl font-semibold mb-1">Course Structure</h2>
          <p className="mb-6">
            {courseDetails.courseContent.length} section -{" "}
            {calculateNumberOfLectures(courseDetails)} lectures -{" "}
            {calculateCourseTime(courseDetails)} total duration
          </p>
          {courseDetails.courseContent.map((chapter, index) => (
            <div
              key={index}
              className="text-gray-800 border border-gray-500/30"
            >
              <div
                className="flex flex-col gap-2 items-center cursor-pointer p-3 border-b 
              border-gray-500/30 bg-[#F7F9FD] select-none"
                onClick={() => toggleSection(index)}
              >
                <div>
                  <div className="flex items-center gap-2 ">
                    <img
                      src={assets.down_arrow_icon}
                      alt="arrow-down"
                      className={`transform transition-transform duration-300 ${openSection[index] ? "rotate-180" : ""}`}
                    />
                    <p className="font-medium">{chapter.chapterTitle}</p>
                  </div>
                </div>
                <p className="text-sm">
                  {chapter.chapterContent.length} lectures -{" "}
                  {calculateChapterTime(chapter)}
                </p>
              </div>
              <div
                className={`transition-all duration-300 overflow-hidden
                ${openSection[index] ? "max-h-96" : "max-h-0"}`}
              >
                <div className="py-4">
                  {chapter.chapterContent.map((lecture) => (
                    <div
                      key={lecture.lectureId}
                      className="px-6 py-2 flex items-center max-sm:flex-wrap max-sm:gap-2 justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <img src={assets.play_icon} alt="play icon" />
                        <p>{lecture.lectureTitle}</p>
                      </div>
                      <div className="flex gap-2 max-sm:pl-6 items-center text-sm">
                        {lecture.isPreviewFree && (
                          <p
                            onClick={() =>
                              setPlayerData({
                                videoId: lecture.lectureUrl.split("/").pop(),
                              })
                            }
                            className="cursor-pointer text-blue-500"
                          >
                            Preview
                          </p>
                        )}
                        <p>
                          {humanizeDuration(
                            lecture.lectureDuration * 60 * 1000,
                            {
                              units: ["h", "m"],
                            },
                          )}{" "}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <h3 className="text-3xl font-semibold">Course Description:</h3>
          <p
            className="text-gray-500 md:text-base text-sm rich-text"
            dangerouslySetInnerHTML={{
              __html: courseDetails.courseDescription,
            }}
          ></p>
        </div>
      </div>
      {/* right column */}
      <div className="md:min-w-[300px] md:max-w-[420px] w-full shadow-(--custom-card-shadow) pb-6 z-10">
        {playerData ? (
          <YouTube
            videoId={playerData.videoId}
            iframeClassName="w-full aspect-video"
            opts={{ playerVars: { autoplay: 1 } }}
          />
        ) : (
          <img
            className="mb-3"
            src={courseDetails.courseThumbnail}
            alt={courseDetails.courseTitle}
          />
        )}
        <div className="px-5 flex flex-col gap-3">
          <p className="flex gap-2 text-[#FF4B4B] max-sm:text-sm flex-wrap">
            <img src={assets.time_left_clock_icon} alt="time left clock" />{" "}
            <span className="font-bold">5 Days</span> left at this price!
          </p>
          <div className="flex gap-2 items-center">
            <h2 className="font-bold text-3xl max-sm:text-2xl">
              {currency}
              {(
                (courseDetails.coursePrice * (100 - courseDetails.discount)) /
                100
              ).toFixed(2)}
            </h2>
            <p className="text-gray-500 max-sm:text-sm line-through">
              {courseDetails.coursePrice}
            </p>
            <p className="text-gray-500 max-sm:text-sm">
              {courseDetails.discount}% off
            </p>
          </div>
          <div
            className="flex items-center gap-4 
          flex-wrap text-gray-500 text-sm md:text-default"
          >
            <p className="flex gap-1 items-center">
              <img src={assets.star} alt="star" />
              {calculateRating(courseDetails)}
            </p>
            <div className="bg-gray-500 w-px h-4 max-sm:hidden"></div>
            <p className="flex gap-1 items-center">
              <img src={assets.time_clock_icon} alt="clock" />
              {calculateCourseTime(courseDetails)}
            </p>
            <div className="bg-gray-500 w-px h-4 max-sm:hidden"></div>
            <p className="flex gap-1 items-center">
              <img src={assets.lesson_icon} alt="lesson" />
              {calculateNumberOfLectures(courseDetails)} lessons
            </p>
          </div>
          <button
            onClick={enrollCourse}
            className={`text-white ${isEnrolled ? "bg-gray-500" : "bg-blue-500"} font-medium rounded-md block 
          w-full py-3 ${isEnrolled ? "cursor-not-allowed" : "cursor-pointer"}`}
          >
            {isEnrolled ? "Already Enrolled" : "Enroll Now"}
          </button>

          <div>
            <h3 className="mb-3">What's in the course?</h3>
            <ul className="text-gray-500 text-sm flex flex-col gap-2 list-disc ml-5">
              <li>Lifetime access with free updates.</li>
              <li>Step-by-step, hands-on project guidance.</li>
              <li>Downloadable resources and source code.</li>
              <li>Quizzes to test your knowledge.</li>
              <li>Certain of completion.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default CourseDetails;
