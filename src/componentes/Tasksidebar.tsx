import React from "react";
import { NavLink } from "react-router-dom";

type TaskSidebarProps = {
  setStatus?: React.Dispatch<React.SetStateAction<"PENDING" | "IN_PROGRESS" | "COMPLETED" | "">>;
};

export const TaskSidebar: React.FC<TaskSidebarProps> = ({ setStatus }) => {
  const role = localStorage.getItem("Utype");

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-indigo-50 text-indigo-600 shadow-sm"
        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
    }`;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm min-h-[calc(100vh-120px)] flex flex-col justify-between">
      <div className="space-y-6">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2">
            Workspace
          </p>
          <h2 className="text-lg font-bold text-gray-900 px-2 mt-1 flex items-center gap-2">
            <span>📋</span> {role === "ADMIN" ? "Admin Panel" : "User Tasks"}
          </h2>
        </div>

        <nav className="space-y-1.5">
          <NavLink to="/tasks" className={navItemClass} end onClick={() => setStatus && setStatus("")}>
            <span className="text-base">📁</span>
            <span>All Tasks</span>
          </NavLink>

          {role === "ADMIN" && (
            <NavLink to="/admin/all-users" className={navItemClass}>
              <span className="text-base">👥</span>
              <span>All Users</span>
            </NavLink>
          )}

          <hr className="border-gray-100 my-4" />

          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">
            Quick Filters
          </p>

          <button
            onClick={() => setStatus && setStatus("PENDING")}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-amber-50 hover:text-amber-700 transition-all duration-200 text-left"
          >
            <span className="text-base text-amber-500">⏳</span>
            <span>Pending Tasks</span>
          </button>
        </nav>
      </div>

     
    </div>
  );
};