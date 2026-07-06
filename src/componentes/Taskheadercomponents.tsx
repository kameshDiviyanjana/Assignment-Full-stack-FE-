import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../api/aut.api";

export const Taskheadercomponents: React.FC = () => {
  const { data, isLoading } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const utype = localStorage.getItem("Utype");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken"); 
    localStorage.removeItem("refreshToken");
    localStorage
.removeItem("Utype"); // Clear user type
    localStorage.removeItem("OwId"); // Clear user ID

    navigate("/"); 
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Left Side: Brand Logo */}
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
            A
          </div>
          <h1 className="text-xl font-bold text-gray-800">
            {utype === "ADMIN" ? "Admin Dashboard" : "User Dashboard"}
          </h1>
        </div>

        <div className="flex items-center space-x-4 relative" ref={dropdownRef}>
          {isLoading ? (
            <div className="flex items-center space-x-3 animate-pulse">
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
            </div>
          ) : (
            <>
              <span className="text-sm text-gray-600 font-medium hidden sm:inline">
                Welcome, {username}
              </span>

              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="h-8 w-8 rounded-full bg-indigo-200 border border-indigo-400 flex items-center justify-center text-xs font-bold text-indigo-700 hover:ring-2 hover:ring-indigo-500/40 transition focus:outline-none"
              >
                {username?.charAt(0).toUpperCase() || "U"}
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 top-11 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-fade-in">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Account</p>
                    <p className="text-sm font-bold text-gray-800 mt-1">
                      {data?.user?.fristname} {data?.user?.lastname || ""}
                    </p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {data?.user?.email || "no-email@domain.com"}
                    </p>
                  </div>

                  <div className="p-1.5 space-y-0.5">
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        console.log("Trigger update profile modal from here");
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium flex items-center gap-2"
                    >
                      <span>⚙️</span> Update Details
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium flex items-center gap-2"
                    >
                      <span>🚪</span> Logout
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};