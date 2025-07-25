import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../../lib/SupabaseClient";
import { FileText, User, LogOut, Sparkles } from "lucide-react";
import { useMarkdownContext } from "../../Context/context";
import SidebarButton from "./SidebarButton";

const Navbar = () => {
  const [userEmail, setUserEmail] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {isOpen, toggleSidebar} = useMarkdownContext()
  const navigate = useNavigate();


  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email);
      } else if (error) {
        console.error("Error fetching user:", error.message);
      }
    };

    fetchUser();
  }, []);

  const handleSignOut = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      setUserEmail(null);
      navigate("/login");
    }
    setIsLoading(false);
  }

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 shadow-2xl border-b border-blue-800/30">
      <div className="flex items-center gap-4  w-full h-20 px-8">
        <SidebarButton toggleSidebar={toggleSidebar} isOpen={isOpen}/>
        <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3 px-0 sm:px-4 py-2 rounded-xl lg:bg-white/10 lg:backdrop-blur-sm lg:border lg:border-blue-400/20 lg:shadow-md transition-all duration-200">
          <div className="hidden lg:block">
          <div className="relative flex items-center">
            <FileText className="w-7 h-7 text-blue-400 drop-shadow" strokeWidth={2.2} />
            <Sparkles
              className="absolute -top-2 -right-2 w-5 h-5 text-purple-400 animate-pulse"
              strokeWidth={2.2}
              style={{ filter: "drop-shadow(0 0 6px #a78bfa)" }}
            />
          </div>
          </div>
          <span className="text-sm mt-1 sm:mt-0 mx-0 sm:mx-2 sm:text-xl font-bold text-white tracking-wide select-none text-center sm:text-left">
            Markdown Magic
          </span>
        </div>

        {/* Right side - User Info */}
        <div className="flex-1 flex justify-end">
          {userEmail ? (
            <div className="flex items-center gap-4">
              {/* User Avatar & Info */}
              <div className="hidden md:flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                <div className="p-2 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full">
                  <User className="w-4 h-4 text-white" strokeWidth={2} />
                </div>
                <div className="text-right">
                  <p className="text-white text-sm font-medium">Welcome back!</p>
                  <p className="text-blue-200 text-xs truncate max-w-32">
                    {userEmail}
                  </p>
                </div>
              </div>

              {/* Mobile User Indicator */}
              <div className="md:hidden p-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <User className="w-5 h-5 text-white" strokeWidth={2} />
              </div>

              {/* Logout Button */}
              <button
                className="group relative bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium px-4 py-2.5 rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 border border-red-400/50"
                onClick={handleSignOut}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <LogOut className="w-4 h-4" strokeWidth={2} />
                )}
                <span className="hidden sm:inline">
                  {isLoading ? "Signing out..." : "Logout"}
                </span>
                
                {/* Tooltip for mobile */}
                <div className="sm:hidden absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                  Logout
                </div>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-blue-200">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-sm">Loading...</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;