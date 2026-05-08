import React, { useState } from "react";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ data }) => {
  const navigate = useNavigate();
  const [input, setInput] = useState(data ? data : "");

  const onSearchHandler = (e) => {
    e.preventDefault();
    navigate("/courses-list/" + input);
  };

  return (
    <form
      onSubmit={onSearchHandler}
      className="max-w-xl w-full md:h-14 h-12 flex items-center bg-white border 
    border-gray-500/30 rounded"
    >
      <img
        src={assets.search_icon}
        alt="search_icon"
        className="md:w-auto w-10 px-3"
      />
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        type="text"
        placeholder="Search For Courses"
        className="text-gray-500/80 w-full h-full outline-none"
      />
      <button
        className="rounded bg-(--color-primary) md:py-3 py-2 md:px-10 px-7 
      text-white mx-1 cursor-pointer"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
