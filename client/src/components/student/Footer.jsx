import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";

const Footer = () => {
  return (
    <footer className="bg-gray-900 w-full lg:px-40 px-8 text-left">
      <ul
        className="flex flex-col gap-10 lg:gap-32 md:flex-row 
      md:items-start border-b border-white/30 py-16"
      >
        <li className="flex flex-col gap-3 md:items-start items-center w-full">
          <img src={assets.logo_dark} alt="logo" className="w-30" />
          <p className="text-white/80 text-center md:text-left text-sm">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text.
          </p>
        </li>
        <li className="flex flex-col md:items-start items-center w-full">
          <h2 className="font-semibold text-xl text-white mb-3">Company</h2>
          <ul
            className="text-gray-500 flex flex-row flex-wrap md:flex-col 
          max-sm:justify-center gap-3 text-sm"
          >
            <li>
              <Link className="hover:text-white transition" to={"/"}>
                Home
              </Link>
            </li>
            <li>
              <Link className="hover:text-white transition" to={"/about"}>
                About us
              </Link>
            </li>
            <li>
              <a
                className="hover:text-white transition"
                href="https://wa.me/201141554814"
                target="_blank"
                rel="noopener noreferrer"
              >
                Contact us
              </a>
            </li>
            <li>
              <Link
                className="hover:text-white transition"
                to={"/privacy-policy"}
              >
                Privacy policy
              </Link>
            </li>
          </ul>
        </li>
        <li className="hidden md:flex flex-col w-full">
          <div>
            <h2 className="font-semibold text-xl text-white mb-3">
              Subscribe to our newsletter
            </h2>
            <p className="text-white/80 text-sm">
              The latest news, articles, and resources, sent to your inbox
              weekly.
            </p>
            <div className="mt-5 flex gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-[#1F2937] border border-white/10 
                outline-none focus:border-white text-gray-500 px-2 rounded-md max-w-64 h-9"
              />
              <button
                className="text-white text-sm bg-blue-600 
              font-medium w-24 h-9 rounded-md cursor-pointer"
              >
                Subscribe
              </button>
            </div>
          </div>
        </li>
      </ul>
      <p className="text-gray-500 text-center py-4">
        Copyright 2026 © Edemy - Madkour. All Right Reserved.
      </p>
    </footer>
  );
};

export default Footer;
