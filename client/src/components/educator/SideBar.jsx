import { Link, useLocation } from "react-router-dom";
import { assets } from "../../assets/assets";

const SideBar = () => {
  const location = useLocation();
  let menu = [
    { icon: assets.home_icon, title: "Dashboard", url: "/educator" },
    {
      icon: assets.add_icon,
      title: "Add Course",
      url: "/educator/add-courses",
    },
    {
      icon: assets.my_course_icon,
      title: "My Courses",
      url: "/educator/my-courses",
    },
    {
      icon: assets.person_tick_icon,
      title: "Students Enrolled",
      url: "/educator/students-enrolled",
    },
  ];
  return (
    <aside
      className="flex flex-col
      border-r border-(--border-borderColor) max-sm:min-w-12 w-full md:max-w-60 min-h-screen max-w-13"
    >
      <div>
        {menu.map((item,index) => {
          return (
            <Link key={index}
              to={`${item.url}`}
              className={`flex gap-2 relative py-3 md:pl-8 pl-3 items-center ${
                item.url === location.pathname
                  ? "bg-primary/10 border-r-4 border-primary"
                  : ""
              }
            hover:bg-primary/10 transition duration-300`}
            >
              <img src={item.icon} alt="" />
              <p className="max-md:hidden">{item.title}</p>
            </Link>
          );
        })}
      </div>
    </aside>
  );
};

export default SideBar;
