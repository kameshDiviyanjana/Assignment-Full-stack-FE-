import React, { useState } from 'react';
import { TableCommon, type Column } from '../atomes/TableCommon';
import { Taskheadercomponents } from '../componentes/Taskheadercomponents';
import { TaskSidebar } from '../componentes/Tasksidebar';
import { ActiveAndDeactiveUser, AdminAllUser } from '../api/user.api'; // Import your new api handler
import { CommonModal } from '../atomes/CommonModal';
import { Button } from '../atomes/Button';
import { AdminUserRegister } from '../componentes/AdminuserRegister';

export type User = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: 'ADMIN' | 'USER';
  isActive: boolean; // Add status field value flag here
  createdAt: string;
};

export const AdminAllUsersPage: React.FC = () => {
  const [deleteisModalOpen, setDeleteisModalOpen] = useState(false);
  const [selectedUserDetails, setSelectedUserDetails] = useState<User | null>(null);
  const [createUserModalOpen, setCreateUserModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;


  // 1. Fetch user collection
  const { data: apiResponse, isLoading, isError } = AdminAllUser({
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery || undefined,
  });

  const users: User[] = apiResponse?.data?.data || [];
  const meta = apiResponse?.data?.meta || { total: 0, totalPages: 1, page: 1 };

  // 2. React Query Mutation to handle toggle state changes on the server side
  const toggleStatusMutation = ActiveAndDeactiveUser()

  const handleDeleteUser = (user: User) => {
    console.log("Deleting User ID:", user.id);
  };

  // 3. Define columns including the interactive Toggle row switcher
  const userColumns = [
    {
      header: "Name",
      accessor: "firstname",
      render: (_, row: User) => (
        <span className="font-medium text-gray-900">
          {row.firstname} {row.lastname}
        </span>
      )
    },
    { header: "Email Address", accessor: "email" },
    {
      header: "Role",
      accessor: "role",
      render: (val: string) => (
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${val === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
          }`}>
          {val}
        </span>
      )
    },

    {
      header: "Joined Date",
      accessor: "createdAt",
      render: (val: string) => (
        <span className="text-gray-500 text-sm">
          {new Date(val).toLocaleDateString(undefined, { dateStyle: 'medium' })}
        </span>
      )
    },
    {
      header: "Status",
      accessor: "isActive",
      render: (val: boolean, row: User) => (
        <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            disabled={toggleStatusMutation.isPending}
            onClick={() => {
              // Pass 'isActive' instead of 'status'
              toggleStatusMutation.mutate({
                id: row.id,
                isActive: !val // Invert the boolean flag state
              });
            }}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${val ? 'bg-green-500' : 'bg-gray-200'
              } ${toggleStatusMutation.isPending ? 'opacity-50 cursor-wait' : ''}`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${val ? 'translate-x-5' : 'translate-x-0'
                }`}
            />
          </button>
          <span className="ml-2 text-xs font-medium text-gray-600 min-w-[45px]">
            {val ? 'Active' : 'Inactive'}
          </span>
        </div>
      )
    },

  ] satisfies Column<User>[];

  const handleCreateUser = () => {
    setCreateUserModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans antialiased">
      <Taskheadercomponents />

      <div className="flex flex-col lg:flex-row gap-6 w-full mx-auto p-4 lg:p-6">
        <div className="lg:w-64 w-full flex-shrink-0">
          <TaskSidebar />
        </div>

        <div className="flex-1 w-full space-y-6">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="🔍 Search users by name or email..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="text-sm text-gray-500 font-medium px-2">
              Total Users: {meta.total}
            </div>
            <div className="text-sm text-gray-500 font-medium px-2">
              <Button Onclick={handleCreateUser} btname={'create user'} btcolor={'bg-indigo-600'} btstyle={' text-white'} />
              <AdminUserRegister isModalOpen={createUserModalOpen} handleClose={() => setCreateUserModalOpen(false)} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-wrap gap-4">
              <h2 className="text-lg font-semibold text-gray-900">User Directory</h2>
            </div>

            {isLoading ? (
              <div className="p-12 text-center text-gray-500 animate-pulse">Loading directory registry components...</div>
            ) : isError ? (
              <div className="p-12 text-center text-red-500 font-medium">Failed to fetch system accounts.</div>
            ) : (
              <TableCommon
                columns={userColumns}
                data={users}
                onRowClick={(user) => setSelectedUserDetails(user)}
              />
            )}

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Page <span className="font-bold text-gray-800">{meta.page}</span> of <span className="font-bold text-gray-800">{meta.totalPages}</span>
              </span>

              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1 || isLoading}
                  className="px-3 py-1.5 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, meta.totalPages))}
                  disabled={currentPage === meta.totalPages || isLoading}
                  className="px-3 py-1.5 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          <div className="open-modal-wrapper">
            <CommonModal isOpen={deleteisModalOpen} onClose={() => setDeleteisModalOpen(false)} title="Remove Account" position="center" height="half">
              <div className="p-6 text-center h-28">
                <p className="text-gray-700">
                  Are you sure you want to remove <span className="font-semibold">{selectedUserDetails?.email}</span>? This action is permanent.
                </p>
                <div className="mt-4 flex justify-center gap-4">
                  <button
                    onClick={() => {
                      if (selectedUserDetails) {
                        handleDeleteUser(selectedUserDetails);
                      }
                      setDeleteisModalOpen(false);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Confirm Delete
                  </button>
                  <button
                    onClick={() => setDeleteisModalOpen(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </CommonModal>
          </div>

        </div>
      </div>
    </div>
  );
};