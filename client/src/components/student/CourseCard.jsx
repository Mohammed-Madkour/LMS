import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";

const CourseCard = ({ course }) => {
  const { currency, calculateRating } = useContext(AppContext);

  return (
    <Link
      to={"/course/" + course._id}
      onClick={scrollTo(0, 0)}
      className="border cursor-pointer 
    rounded-lg pb-6 border-gray-500/30 overflow-hidden"
    >
      <img
        src={course.courseThumbnail}
        className="mb-2"
        alt={course.courseTitle}
      />
      <div className="flex flex-col ml-3">
        <h3 className="font-semibold">{course.courseTitle}</h3>
        <p className="text-gray-500">{course.educator.name}</p>
        <div className="flex gap-1 items-center">
          <p>{calculateRating(course)}</p>
          <div className="flex">
            {[...Array(5)].map((star, i) => (
              <img
                key={i}
                className="w-3.5 h-3.5"
                src={
                  i < Math.floor(calculateRating(course))
                    ? assets.star
                    : assets.star_blank
                }
                alt="star"
              ></img>
            ))}
          </div>
          <p className="text-gray-500">({course.courseRatings.length})</p>
        </div>
        <p className="text-base font-semibold text-gray-800">
          {currency}
          {((course.coursePrice * (100 - course.discount)) / 100).toFixed(2)}
        </p>
      </div>
    </Link>
  );
};

export default CourseCard;
