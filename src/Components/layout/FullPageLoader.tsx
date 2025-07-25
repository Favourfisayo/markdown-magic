import {  } from "lucide-react";
import { BeatLoader } from "react-spinners";

const FullPageLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="flex flex-col items-center gap-4">
        <BeatLoader color="#155dfc"/>
        <p className="text-gray-600 font-medium text-lg">Loading...</p>
      </div>
    </div>
  );
};

export default FullPageLoader;
