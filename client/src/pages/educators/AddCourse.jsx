import { useEffect, useRef, useState } from "react";
import Quill from "quill";
import uniqid from "uniqid";
import { assets } from "../../assets/assets";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const AddCourse = () => {
  const { getToken, backendUrl } = useContext(AppContext);
  const quillRef = useRef(null);
  const editorRef = useRef(null);

  const [image, setImage] = useState(null);

  const [courseData, setCourseData] = useState({
    title: "",
    price: 0,
    description: "",
    discount: 0,
  });

  const [chapters, setChapters] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);

  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: "",
    lectureDuration: "",
    lectureUrl: "",
    isPreviewFree: false,
  });

  const handleChapter = (action, chapterId) => {
    if (action === "add") {
      const title = prompt("Add Your Chapter Title.");
      if (title) {
        const newChapter = {
          chapterId: uniqid(),
          chapterTitle: title,
          collapsed: false,
          chapterContent: [],
          chapterOrder:
            chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1,
        };
        setChapters([...chapters, newChapter]);
      }
    } else if (action === "remove") {
      setChapters(
        chapters.filter((chapter) => chapter.chapterId !== chapterId),
      );
    } else if (action === "toggle") {
      setChapters(
        chapters.map((chapter) =>
          chapter.chapterId === chapterId
            ? { ...chapter, collapsed: !chapter.collapsed }
            : chapter,
        ),
      );
    }
  };

  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === "add") {
      setCurrentChapterId(chapterId);
      setShowPopup(true);
    } else if (action === "remove") {
      setChapters(
        chapters.map((chapter) => {
          if (chapter.chapterId === chapterId) {
            chapter.chapterContent.splice(lectureIndex, 1);
          }
          return chapter;
        }),
      );
    }
  };

  const addLecture = () => {
    setChapters(
      chapters.map((chapter) => {
        if (chapter.chapterId === currentChapterId) {
          const newLecture = {
            lectureId: uniqid(),
            ...lectureDetails,
            lectureOrder:
              chapter.chapterContent.length > 0
                ? chapter.chapterContent.slice(-1)[0].lectureOrder + 1
                : 1,
          };
          chapter.chapterContent.push(newLecture);
        }
        return chapter;
      }),
    );

    setShowPopup(false);
    setLectureDetails({
      lectureTitle: "",
      lectureDuration: "",
      lectureUrl: "",
      isPreviewFree: false,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!image) {
        toast.error("Thumbnail is Required");
        return;
      }
      const course = {
        courseTitle: courseData.title,
        courseDescription: quillRef.current.root.innerHTML,
        coursePrice: Number(courseData.price),
        discount: Number(courseData.discount),
        courseContent: chapters,
      };

      const formData = new FormData();
      formData.append("courseData", JSON.stringify(course));
      formData.append("image", image);

      const token = await getToken();
      const { data } = await axios.post(
        backendUrl + "/api/educator/add-course",
        formData,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (data.success) {
        toast.success(data.message);
        setCourseData({ title: "", price: 0, discount: 0, description: "" });
        setImage(null);
        setChapters([]);
        quillRef.current.root.innerHTML = "";
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    // Initiate Quill only once
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
      });
    }
  }, []);

  return (
    <form onSubmit={handleSubmit} className="max-w-xl flex flex-col gap-5">
      <div className="flex w-full flex-col gap-1">
        <label htmlFor="title" className="text-gray-700">
          Course Title
        </label>
        <input
          className="text-gray-500 py-1.5 px-3 border 
          border-gray-500 w-full rounded-md outline-primary"
          required
          type="text"
          id="title"
          placeholder="Type here"
          value={courseData.title}
          onChange={(e) =>
            setCourseData({ ...courseData, title: e.target.value })
          }
        />
      </div>
      <div className="flex w-full flex-col gap-1">
        <p className="text-gray-700">Course Description</p>
        <div ref={editorRef}></div>
      </div>
      <div className="flex md:items-center md:flex-row flex-col justify-between gap-3">
        <div className="flex flex-col gap-1 ">
          <label htmlFor="price" className="text-gray-700">
            Course Price
          </label>
          <input
            className="text-gray-500 py-1.5 px-3 border 
          border-gray-500 w-60 rounded-md outline-primary"
            required
            type="number"
            id="price"
            min={0}
            value={courseData.price || ""}
            placeholder="0"
            onChange={(e) =>
              setCourseData({ ...courseData, price: e.target.value })
            }
          />
        </div>
        <div className="flex items-center gap-3">
          <p>Course Thumbnail</p>
          <label
            htmlFor="thumbnailImage"
            className="flex items-center gap-3 cursor-pointer"
          >
            <img
              src={assets.file_upload_icon}
              alt=""
              className="bg-blue-500 p-3 rounded"
            />
            <input
              type="file"
              id="thumbnailImage"
              onChange={(e) => setImage(e.target.files[0])}
              accept="image/*"
              hidden
            />
          </label>
          <img
            className="max-h-10"
            src={image ? URL.createObjectURL(image) : ""}
            alt=""
          />
        </div>
      </div>
      <div className="flex w-full flex-col gap-1">
        <label htmlFor="discount" className="text-gray-700">
          Course Discount %
        </label>
        <input
          className="text-gray-500 py-1.5 px-3 border 
          border-gray-500 w-60 rounded-md outline-primary"
          min={0}
          max={100}
          type="number"
          id="discount"
          placeholder="0"
          value={courseData.discount || ""}
          onChange={(e) =>
            setCourseData({ ...courseData, discount: e.target.value })
          }
        />
      </div>

      {/* Add Chaptes & Lectures */}
      <div>
        {chapters.map((chapter, chapterIndex) => (
          <div
            key={chapterIndex}
            className="bg-white border border-gray-500/30 rounded-lg mb-4"
          >
            <div className="flex items-center justify-between p-4 border-gray-500/30 border-b">
              <div className="flex items-center ">
                <img
                  onClick={() => handleChapter("toggle", chapter.chapterId)}
                  className={`mr-2 transition-all cursor-pointer ${chapter.collapsed && "-rotate-90"}`}
                  src={assets.down_arrow_icon}
                  alt=""
                />
                <span className="font-semibold">
                  {chapterIndex + 1} {chapter.chapterTitle}
                </span>
              </div>
              <span className="text-gray-500">
                {chapter.chapterContent.length} Lectures
              </span>
              <img
                src={assets.cross_icon}
                onClick={() => handleChapter("remove", chapter.chapterId)}
                alt=""
                className="cursor-pointer"
              />
            </div>
            {!chapter.collapsed && (
              <div className="p-4">
                {chapter.chapterContent.map((lecture, lectureIndex) => (
                  <div
                    key={lectureIndex}
                    className="flex justify-between items-center mb-2"
                  >
                    <span>
                      {lectureIndex + 1} {lecture.lectureTitle} -{" "}
                      {lecture.lectureDuration} mins -{" "}
                      <a
                        target="_blank"
                        className="text-blue-500"
                        href={lecture.lectureUrl}
                      >
                        Link
                      </a>{" "}
                      - {lecture.isPreviewFree ? "Free Preview" : "Paid"}
                    </span>
                    <img
                      onClick={() =>
                        handleLecture("remove", chapter.chapterId, lectureIndex)
                      }
                      src={assets.cross_icon}
                      className="cursor-pointer"
                      alt=""
                    />
                  </div>
                ))}
                <div
                  onClick={() => handleLecture("add", chapter.chapterId)}
                  className="bg-gray-100 p-2 rounded-lg cursor-pointer mt-2 w-fit"
                >
                  + Add Lecture
                </div>
              </div>
            )}
          </div>
        ))}
        <div
          className="text-center text-gray-700 p-2 w-full 
        bg-blue-100 rounded cursor-pointer"
          onClick={() => handleChapter("add")}
        >
          + Add Chapter
        </div>
        {showPopup && (
          <div className="fixed flex items-center justify-center  w-full h-screen top-0 left-0">
            <div className="fixed w-full h-screen top-0 left-0 opacity-50 bg-gray-800"></div>
            <div className="bg-white text-gray-700 p-4 rounded relative w-full max-w-80">
              <h2 className="text-lg font-medium mb-4">Add Lecture</h2>
              <div className="mb-2">
                <p>Lecture Title</p>
                <input
                  type="text"
                  className="block w-full border rounded py-1 px-2 focus:border-primary"
                  value={lectureDetails.lectureTitle}
                  onChange={(e) =>
                    setLectureDetails({
                      ...lectureDetails,
                      lectureTitle: e.target.value,
                    })
                  }
                />
              </div>
              <div className="mb-2">
                <p>Duration (minutes)</p>
                <input
                  type="number"
                  className="block w-full border rounded py-1 px-2 focus:border-primary"
                  value={lectureDetails.lectureDuration}
                  onChange={(e) =>
                    setLectureDetails({
                      ...lectureDetails,
                      lectureDuration: e.target.value,
                    })
                  }
                />
              </div>
              <div className="mb-2">
                <p>Lecture URL</p>
                <input
                  type="text"
                  className="block w-full border rounded py-1 px-2 focus:border-primary"
                  value={lectureDetails.lectureUrl}
                  onChange={(e) =>
                    setLectureDetails({
                      ...lectureDetails,
                      lectureUrl: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex gap-2 mb-2">
                <p>Is Preview Free?</p>
                <input
                  type="checkbox"
                  className="scale-125"
                  checked={lectureDetails.isPreviewFree}
                  onChange={(e) =>
                    setLectureDetails({
                      ...lectureDetails,
                      isPreviewFree: e.target.checked,
                    })
                  }
                />
              </div>
              <button
                onClick={() => addLecture()}
                className="w-full bg-blue-400 text-white px-4 py-2 rounded"
              >
                Add
              </button>
              <img
                onClick={() => setShowPopup(false)}
                src={assets.cross_icon}
                alt="close-icon"
                className="cursor-pointer absolute top-4 right-4 w-4"
              />
            </div>
          </div>
        )}
      </div>
      <button
        type="submit"
        className="bg-black text-white font-medium cursor-pointer w-max px-8 py-2.5 rounded mb-4"
      >
        ADD
      </button>
    </form>
  );
};

export default AddCourse;
