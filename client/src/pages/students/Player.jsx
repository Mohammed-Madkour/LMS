import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { useParams } from "react-router-dom";
import { assets } from "../../assets/assets";
import humanizeDuration from "humanize-duration";
import YouTube from "react-youtube";
import Rating from "../../components/student/Rating";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../../components/student/Loading";

const Player = () => {
  const {
    enrolledCourses,
    calculateChapterTime,
    getToken,
    backendUrl,
    fetchEnrolledCourses,
    userData,
  } = useContext(AppContext);

  const { courseId } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [openSection, setOpenSection] = useState({});
  const [playerData, setPlayerData] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [initialRating, setInitialRating] = useState(0);

  const toggleSection = (index) => {
    setOpenSection((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const getCourseData = () => {
    enrolledCourses.map((course) => {
      if (course._id === courseId) {
        setCourseData(course);
        course.courseRatings.map((item) => {
          if (item.userId === userData._id) {
            setInitialRating(item.rating);
          }
        });
      }
    });
  };

  useEffect(() => {
    if (enrolledCourses.length > 0) {
      getCourseData();
    }
  }, [enrolledCourses]);

  const markLectureCompleted = async (lectureId) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        backendUrl + "/api/user/update-progress",
        { courseId, lectureId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (data.success) {
        toast.success(data.message);
        getCourseProgress();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getCourseProgress = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        backendUrl + "/api/user/get-progress",
        { courseId },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (data.success) {
        setProgressData(data.progressData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleRating = async (rating) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        backendUrl + "/api/user/add-rating",
        { courseId, rating },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (data.success) {
        toast.success(data.message);
        fetchEnrolledCourses();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getCourseProgress();
  }, []);

  return courseData ? (
    <div
      className="flex md:flex-row flex-col-reverse md:items-start items-center lg:px-40 px-8
    py-16 md:justify-between gap-16 relative"
    >
      {/* left column */}
      <div className="md:max-w-2xl w-full">
        <h2 className=" text-2xl font-semibold mb-3">Course Structure</h2>
        {courseData &&
          courseData.courseContent.map((chapter, index) => (
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
                  {chapter.chapterContent.map((lecture, i) => (
                    <div
                      key={lecture.lectureId}
                      className="px-6 py-2 flex items-center max-sm:flex-wrap max-sm:gap-2 justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={
                            progressData &&
                            progressData.lectureCompleted.includes(
                              lecture.lectureId,
                            )
                              ? assets.blue_tick_icon
                              : assets.play_icon
                          }
                          alt="play icon"
                        />
                        <p>{lecture.lectureTitle}</p>
                      </div>
                      <div className="flex gap-2 max-sm:pl-6 items-center text-sm">
                        {lecture.lectureUrl && (
                          <p
                            onClick={() =>
                              setPlayerData({
                                ...lecture,
                                chapter: index + 1,
                                lecture: i + 1,
                              })
                            }
                            className="cursor-pointer text-blue-500"
                          >
                            Watch
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

        <div className="flex items-center gap-2 mt-10">
          <h2 className="font-bold text-lg">Rate This Course:</h2>
          <Rating initialRating={initialRating} onRate={handleRating} />
        </div>
      </div>
      {/* right column */}
      <div className="md:max-w-xl shadow-(--custom-card-shadow)">
        {playerData ? (
          <>
            <YouTube
              videoId={playerData.lectureUrl.split("/").pop()}
              iframeClassName="w-full aspect-video"
              opts={{ playerVars: { autoplay: 1 } }}
            />
            <div className="flex flex-wrap justify-between items-center mt-3 px-2 pb-3">
              <p>
                {playerData.chapter}.{playerData.lecture}{" "}
                {playerData.lectureTitle}
              </p>
              <button
                onClick={() => markLectureCompleted(playerData.lectureId)}
                className="cursor-pointer bg-blue-500 
              text-white font-bold p-2 rounded-md text-sm"
              >
                {progressData &&
                progressData.lectureCompleted.includes(playerData.lectureId)
                  ? "Completed"
                  : "Mark Completed"}
              </button>
            </div>
          </>
        ) : (
          <img
            src={courseData?.courseThumbnail || "https://placehold.co/600x400"}
            alt={courseData ? courseData.courseTitle : ""}
          />
        )}
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Player;
