import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
import { UserButton, useUser } from "@clerk/clerk-react";

const Navbar = () => {
  const { user } = useUser();
  return (
    <nav
      className="flex flex-col sm:flex-row justify-between
    px-8 py-4 border-b border-(--border-borderColor) items-center"
    >
      <Link to={"/"}>
        <img src={assets.logo} className="w-28 lg:w-32" alt="logo" />
      </Link>

      <div className="flex gap-2 items-center relative text-gray-500">
        <p>Hi! {user ? user.firstName : "Developers"}</p>
        {user ? <UserButton /> : <img src={assets.user_icon} alt="user_icon" />}
      </div>
    </nav>
  );
};

export default Navbar;
