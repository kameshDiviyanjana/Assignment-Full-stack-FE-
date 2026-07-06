import React from "react";
import { CommonModal } from "../atomes/CommonModal";
import type { Task } from "../util/types";

interface TaskViewProps {
  selectedTaskDetails: Task | null; // Allowed null here to prevent runtime type crashes
  isModalOpen: boolean;
  handleClose: () => void;
}

export const TaskViewcomponente: React.FC<TaskViewProps> = ({
  selectedTaskDetails,
  isModalOpen,
  handleClose,
}) => {
  return (
    <CommonModal
      isOpen={isModalOpen}
      title="Task Details View"
      onClose={handleClose}
      position="right" // Right-side drawer
    >
      {/* 
        REMOVED: The outer white border card wrapper and redundant header text.
        They are perfectly styled inside your custom CommonModal right drawer structure!
      */}
      {selectedTaskDetails ? (
        <div className="space-y-5">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {selectedTaskDetails.title}
            </h3>
            <p className="text-xs text-gray-400 font-mono mt-1 break-all">
              ID: {selectedTaskDetails.id}
            </p>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
              Description
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed bg-gray-50/50 p-3 rounded-lg border border-gray-100">
              {selectedTaskDetails.description || "No description provided."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Status
              </h4>
              <span className={`inline-block mt-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${
                selectedTaskDetails.status === "COMPLETED" ? "bg-green-100 text-green-800" :
                selectedTaskDetails.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-800" : "bg-amber-100 text-amber-800"
              }`}>
                {selectedTaskDetails.status}
              </span>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Due Date
              </h4>
              <p className="mt-2 text-sm font-medium text-gray-800">
                {selectedTaskDetails.dueDate
                  ? new Date(selectedTaskDetails.dueDate).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400 text-sm">
          No task details found. Please pick an active task item to inspect.
        </div>
      )}
    </CommonModal>
  );
};