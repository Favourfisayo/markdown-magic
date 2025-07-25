import {Search, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

const NotFound = ({isRoom}: {isRoom: boolean}) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl text-center">
        <div className="mb-8">
          <div className="text-8xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text mb-4 animate-pulse">
            404
          </div>
          <div className="w-32 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full animate-pulse"></div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">{isRoom ? "Room" : "Page"} Not Found</h2>
          <p className="text-slate-300 text-lg mb-6 leading-relaxed">
            Oops! The {isRoom? "Room": "Page"} you're looking for seems to have vanished into the digital void. 
            Don't worry, even the best markdown gets lost sometimes.
          </p>

          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6 mb-8">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Search className="w-5 h-5" />
              What you can do:
            </h3>
            <ul className="text-slate-300 text-left space-y-2">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                Check the URL for any typos
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                Go back to the previous page
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                Return to the homepage
              </li>
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Start creating amazing markdown content
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleGoBack}
              className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium rounded-xl transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-2"
            >
            <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>

          </div>
        </div>

        <div className="text-slate-400 text-sm italic">
          "In the realm of code, even 404s can be beautiful" ✨
        </div>
      </div>
    </div>
  );
};

export default NotFound;