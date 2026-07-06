

import React, { useState } from 'react';
import type { Task } from '../util/types';
import { TableCommon, type Column } from '../atomes/TableCommon';
import { Taskcreatecomponente } from '../componentes/Taskcreatecomponente';
import { Taskheadercomponents } from '../componentes/Taskheadercomponents';
import { AdminandUserAllTasks, useAndAdminDeleteTask } from '../api/api.task';
import { TaskViewcomponente } from '../componentes/TaskViewcomponente';
import { CommonModal } from '../atomes/CommonModal';
import { Taskupdatecomponente } from '../componentes/Taskupdatecomponente';
import { TaskSidebar } from '../componentes/Tasksidebar';

export const TaskManagerPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteisModalOpen, setDeleteisModalOpen] = useState(false);
  const [viewisModalOpen, setViewisModalOpen] = useState(false);
  const [updateisModalOpen, setUpdateisModalOpen] = useState(false);
  const [selectedTaskDetails, setSelectedTaskDetails] = useState<Task | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [taskStatusFilter, setTaskStatusFilter] = useState<"PENDING" | "IN_PROGRESS" | "COMPLETED" | "">("");
  const itemsPerPage = 10;

  const { data: apiResponse, isLoading, isError } = AdminandUserAllTasks({
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery || undefined,
    status: taskStatusFilter || undefined,
  });

  const {
    mutate: deleteTask,
    isPending: taskpending,
    isError: taskdelete,
    error: taskdeleteerror,
  } = useAndAdminDeleteTask();

  const tasks: Task[] = apiResponse?.data?.data || [];
  const meta = apiResponse?.data?.meta || { total: 0, totalPages: 1, page: 1 };

  const totalTasks = meta.total;
  const completedTasks = tasks.filter((t: any) => t.status === 'COMPLETED').length; // Fallback calculation
  const pendingTasks = totalTasks - completedTasks;

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleOpenViewModal = () => setViewisModalOpen(true);
  const handleCloseViewModal = () => setViewisModalOpen(false);

  const handleOpenDeleteModal = () => setDeleteisModalOpen(true);
  const handleCloseDeleteModal = () => setDeleteisModalOpen(false);

  const handleOpenUpdateModal = () => setUpdateisModalOpen(true);
  const handleCloseUpdateModal = () => setUpdateisModalOpen(false);

  const handleViewTask = (task: Task) => {
    setSelectedTaskDetails(task);
    setViewisModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTaskDetails(task);
    setUpdateisModalOpen(true);
  };

  const handleDeleteTask = (task: Task) => {
    deleteTask(task.id);
  };

  const taskColumns = [
    { header: "Title", accessor: "title" },
    { header: "Description", accessor: "description" },
    {
      header: "Status",
      accessor: "status",
      render: (val: string) => (
        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
          val === 'COMPLETED' ? 'bg-green-100 text-green-800' :
          val === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
        }`}>
          {val}
        </span>
      )
    }, 
  {
    header: "Task owner",
    accessor: "owner",
    render: (_: any, row: Task) => row.owner?.firstname || "-",
  },    {
      header: "Actions",
      accessor: "id", 
      render: (_, row: Task) => (
        <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
          {/* View Icon Button */}
          <button
            onClick={() => handleViewTask(row)}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="View Details"
          >
            👁️
          </button>

          <button
            onClick={() => handleEditTask(row)}
            className="p-1 text-amber-600 hover:bg-amber-50 rounded transition-colors"
            title="Edit Task"
          >
            ✏️
          </button>

          <button
            onClick={() => {
              setSelectedTaskDetails(row);
              handleOpenDeleteModal();
            }}
            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete Task"
          >
            🗑️
          </button>
        </div>
      )
    }
  ] satisfies Column<Task>[];

  return (
    <div className="min-h-screen bg-gray-100 font-sans antialiased">
      <Taskheadercomponents />

      <div className="flex flex-col lg:flex-row gap-6  w-full mx-auto p-4 lg:p-6">
        
        <div className="lg:w-64 w-full flex-shrink-0">
          <TaskSidebar  />
        </div>

        <div className="flex-1 w-full space-y-6">

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Server Tasks</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{totalTasks}</h3>
              </div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">📊</div>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Pending (Current Page)</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{pendingTasks}</h3>
              </div>
              <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">⏳</div>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Completed (Current Page)</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{completedTasks}</h3>
              </div>
              <div className="p-3 bg-green-50 text-green-600 rounded-lg">✅</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="🔍 Search server tasks..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); 
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="sm:w-48">
              <select
                value={taskStatusFilter}
                onChange={(e) => {
                  setTaskStatusFilter(e.target.value as any);
                  setCurrentPage(1); 
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="">All Statuses</option>
                <option value="PENDING">To Do (Pending)</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-wrap gap-4">
              <h2 className="text-lg font-semibold text-gray-900">Task Overview</h2>
              <button
                onClick={handleOpenModal}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
              >
                + Create Task
              </button>
            </div>

            {isLoading ? (
              <div className="p-12 text-center text-gray-500 animate-pulse">Syncing pipeline components data...</div>
            ) : isError ? (
              <div className="p-12 text-center text-red-500 font-medium">Failed to fetch server task indexes.</div>
            ) : (
              <TableCommon
                columns={taskColumns}
                data={tasks}
                onRowClick={(task) => setSelectedTaskDetails(task)}
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

          <TaskViewcomponente selectedTaskDetails={selectedTaskDetails} isModalOpen={viewisModalOpen} handleClose={handleCloseViewModal} />

          <Taskupdatecomponente isModalOpen={updateisModalOpen} handleClose={handleCloseUpdateModal} initialTask={selectedTaskDetails || { title: '', description: '', status: 'PENDING', dueDate: '', ownerId: '' }} />

          <CommonModal isOpen={deleteisModalOpen} onClose={handleCloseDeleteModal} title="Delete Task" position="center" height="half">
            <div className="p-6 text-center h-28">
              <p className="text-gray-700">Are you sure you want to delete this task?</p>
              <div className="mt-4 flex justify-center gap-4">
                <button
                  onClick={() => {
                    if (selectedTaskDetails) {
                      handleDeleteTask(selectedTaskDetails);
                    }
                    handleCloseDeleteModal();
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={handleCloseDeleteModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </CommonModal>

          <Taskcreatecomponente isModalOpen={isModalOpen} handleClose={handleCloseModal} />

        </div>
      </div>
    </div>
  );
};