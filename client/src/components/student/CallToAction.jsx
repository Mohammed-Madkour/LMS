import { useContext } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";

const CallToAction = () => {
  const { navigate } = useContext(AppContext);
  return (
    <section className="py-16 px-8">
      <h1 className="md:text-4xl text-3xl text-gray-800 font-semibold mb-5">
        Learn anything, anytime, anywhere
      </h1>
      <p className="max-md:text-sm text-gray-500">
        Incididunt sint fugiat pariatur cupidatat consectetur sit cillum anim id
        veniam <br /> aliqua proident excepteur commodo do ea.
      </p>

      <div className="flex gap-5 mt-10 items-center w-fit m-auto flex-wrap max-sm:justify-center">
        <button
          onClick={() => {
            navigate("/courses-list");
            scrollTo(0, 0);
          }}
          className="bg-blue-600 text-white font-medium 
        px-6 py-2 rounded-lg cursor-pointer"
        >
          Get started
        </button>
        <button
          className="flex gap-2 items-center font-medium 
        px-6 py-2 rounded-lg cursor-pointer"
        >
          Learn More
          <img src={assets.arrow_icon} alt="arrow" />
        </button>
      </div>
    </section>
  );
};

export default CallToAction;
