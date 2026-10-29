import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const Loading = () => {
  const { path } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(`/${path}`);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div
        className="w-20 h-20 border-4 border-gray-300 border-t-4 border-t-blue-400 
      rounded-full animate-spin "
      ></div>
    </div>
  );
};

export default Loading;
