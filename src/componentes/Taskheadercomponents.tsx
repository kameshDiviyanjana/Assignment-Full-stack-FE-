import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../api/aut.api";
import { useUpdateProfile } from "../api/user.api";

export const Taskheadercomponents: React.FC = () => {
  const { data, isLoading } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: ""
  });

  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const username = localStorage.getItem("username");
  const utype = localStorage.getItem("Utype");

  useEffect(() => {
    if (data?.user) {
      setFormData({
        firstname: data.user.firstname || "",
        lastname: data.user.lastname || "",
        email: data.user.email || ""
      });
    }
  }, [data]);

  const updateProfileMutation = useUpdateProfile();


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
    localStorage.removeItem("Utype");
    localStorage.removeItem("OwId");
    navigate("/");
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userId = data?.user?.id || localStorage.getItem("OwId");

    if (!userId) {
      alert("User ID not found. Cannot update profile.");
      return;
    }

    updateProfileMutation.mutate({
      id: userId,
      payload: {
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email
      }
    });
  };

  return (
    <>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4 flex items-center justify-between">
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
                        {updateProfileMutation.isPending ? (
                          <span className="text-gray-400 animate-pulse">Updating...</span>
                        ) : (
                          `${data?.user?.firstname} ${data?.user?.lastname || ""}`
                        )}
                      </p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {data?.user?.email || "no-email@domain.com"}
                      </p>
                    </div>

                    <div className="p-1.5 space-y-0.5">
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          setIsSidebarOpen(true);
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

      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          />

          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col p-6 z-10 animate-slide-in-right">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Update Profile Details</h2>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-semibold focus:outline-none"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="flex-1 flex flex-col justify-between mt-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstname}
                    onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastname}
                    onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(false)}
                  className="flex-1 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="flex-1 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 rounded-lg transition-colors text-center shadow-md shadow-indigo-600/10"
                >
                  {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};