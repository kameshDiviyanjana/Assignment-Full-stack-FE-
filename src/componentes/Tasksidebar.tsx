import React, { useState } from "react";
import { NavLink } from "react-router-dom";

type TaskSidebarProps = {
  setStatus?: React.Dispatch<React.SetStateAction<"PENDING" | "IN_PROGRESS" | "COMPLETED" | "">>;
};

export const TaskSidebar: React.FC<TaskSidebarProps> = ({ setStatus }) => {
  const role = localStorage.getItem("Utype");
  const [isOpen, setIsOpen] = useState(false); // Tracks mobile slide-out visibility state

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
      ? "bg-indigo-50 text-indigo-600 shadow-sm"
      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
    }`;

  // Helper utility to ensure clicking a navigation option drops the mobile overlay out of sight
  const handleNavigationClick = (filterValue?: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "") => {
    if (setStatus && filterValue !== undefined) {
      setStatus(filterValue);
    }
    setIsOpen(false);
  };

  return (
    <>
      <div className="lg:hidden flex items-center justify-between bg-white border border-gray-200 rounded-xl p-3 shadow-sm mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">📋</span>
          <span className="font-bold text-gray-800 text-sm">
            {role === "ADMIN" ? "Admin Panel" : "User Tasks"}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 focus:outline-none transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {isOpen ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`
          bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between transition-all duration-300 ease-in-out
          
          lg:static lg:block lg:w-full lg:min-h-[calc(100vh-120px)] lg:translate-x-0 lg:z-0
          
          fixed top-0 left-0 bottom-0 w-72 h-full z-50 rounded-r-xl rounded-l-none
          ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-between lg:block">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2">
                Workspace
              </p>
              <h2 className="text-lg font-bold text-gray-900 px-2 mt-1 flex items-center gap-2">
                <span>📋</span> {role === "ADMIN" ? "Admin Panel" : "User Tasks"}
              </h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden text-2xl text-gray-400 hover:text-gray-600 focus:outline-none px-2"
            >
              &times;
            </button>
          </div>

          <nav className="space-y-1.5">
            <NavLink
              to="/tasks"
              className={navItemClass}
              end
              onClick={() => handleNavigationClick("")}
            >
              <span className="text-base">📁</span>
              <span>All Tasks</span>
            </NavLink>

            {role === "ADMIN" && (
              <NavLink
                to="/admin/all-users"
                className={navItemClass}
                onClick={() => setIsOpen(false)}
              >
                <span className="text-base">👥</span>
                <span>All Users</span>
              </NavLink>
            )}


          </nav>
        </div>
      </div>
    </>
  );
};