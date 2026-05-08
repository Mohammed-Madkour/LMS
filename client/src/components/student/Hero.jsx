import { assets } from "../../assets/assets";
import SearchBar from "./SearchBar";

const Hero = () => {
  return (
    <section
      className="md:px-0 w-full px-10 sm:py-10 pt-20 lg:pt-36 
    bg-linear-to-b from-cyan-100/70 text-center flex flex-col justify-center items-center space-y-7"
    >
      <h1 className="md:text-(length:--home-heading-large) text-(length:--home-heading-small) text-gray-800 font-bold max-w-3xl mx-auto ">
        Empower your future with the courses designed to{" "}
        <span className="text-(--color-primary) relative">
          fit your choice.
          <img
            className="absolute md:block hidden -bottom-7 right-0"
            src={assets.sketch}
            alt=""
          />
        </span>
      </h1>
      <p className="text-[#565656] md:max-w-2xl max-w-sm mx-auto ">
        We bring together world-class instructors, interactive content, and a
        supportive community to help you achieve your personal and professional
        goals.
      </p>
      <SearchBar />
    </section>
  );
};

export default Hero;
