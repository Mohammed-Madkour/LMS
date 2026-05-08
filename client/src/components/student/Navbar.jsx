import { assets } from "../../assets/assets.js";
import { Link } from "react-router-dom";
import { useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext.jsx";

const Navbar = () => {
  const { openSignIn } = useClerk();
  const { user } = useUser();
  const { navigate } = useContext(AppContext);

  const isCoursesListPage = location.pathname.includes("courses-list");
  return (
    <nav
      className={` px-8 lg:px-40 py-4 border-b border-(--border-borderColor) 
    flex sm:flex-row flex-col max-sm:gap-2 justify-between items-center ${
      isCoursesListPage ? "bg-white" : "bg-cyan-100/70"
    }`}
    >
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        alt="Logo"
        className="w-28 lg:w-32 cursor-pointer"
      />

      <div className="hidden md:flex items-center gap-5 text-gray-500">
        {user && (
          <div className="flex items-center gap-5">
            <Link to={"/educator"} className="cursor-pointer">Become Educator</Link>{" "}
            <span className="border-r h-4 border-(--border-borderColor)"></span>
            <Link to={"/my-enrollments"}>My Enrollments</Link>
          </div>
        )}
        {user ? (
          <UserButton />
        ) : (
          <button
            onClick={() => openSignIn()}
            className="bg-primary cursor-pointer px-5 py-2 rounded-full text-white"
          >
            Create Account
          </button>
        )}
      </div>

      {/* Phone Screens */}
      <div className="md:hidden flex items-center justify-center gap-2 sm:gap-5 text-gray-500 flex-wrap">
        {user && (
          <div className="flex items-center gap-1 max-sm:text-xs sm:gap-2 ">
            {" "}
            <button className="max-sm:text-[13px] cursor-pointer">
              Become Educator
            </button>{" "}
            <span className="border-r h-4 border-(--border-borderColor)"></span>
            <Link to={"/my-enrollments"}>My Enrollments</Link>
          </div>
        )}
        {user ? (
          <UserButton />
        ) : (
          <button onClick={() => openSignIn()} className="cursor-pointer ">
            <img src={assets.user_icon} className="max-sm:min-w-15px" />
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
