import { useState, useEffect } from "react";
import { Inputecommone } from "../atomes/Inputecommone";
import { Button } from "../atomes/Button";
import { CommonModal } from "../atomes/CommonModal";
import { taskSchema } from "../util/Formvalidation";
import { useAdminAllUsers, useUpdateTask } from "../api/api.task";

interface User {
  id: string;
  firstname: string;
}

export interface TaskForm {
  id?: string;
  title: string;
  description: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  dueDate: string;
  ownerId: string;
}

type TaskUpdateProps = {
  isModalOpen: boolean;
  handleClose(): void;
  initialTask: TaskForm; // Made required for the update modal context
};

export const Taskupdatecomponente: React.FC<TaskUpdateProps> = ({
  isModalOpen,
  handleClose,
  initialTask,
}) => {
  const [currentTask, setCurrentTask] = useState<TaskForm>(initialTask);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  // 1. Fetch users list for owner reassignment
  const { data: users, isLoading: isLoadingUsers } = useAdminAllUsers();
  
  // 2. Load dedicated update mutation pipeline
  const { mutateAsync: updateTask, isPending: isSubmitting } = useUpdateTask();

  // Keep state sync updated when target selection changes in the parent tree
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    if (initialTask) {
      setCurrentTask(initialTask);
    }
    setErrors({});
    setSubmitError(null);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [initialTask, isModalOpen]);

  const validateForm = () => {
    const result = taskSchema.safeParse(currentTask);

    if (result.success) {
      setErrors({});
      return true;
    }

    const fieldErrors: Record<string, string> = {};
    result.error.issues.forEach((issue) => {
      const field = issue.path[0] as string;
      if (!fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    });

    setErrors(fieldErrors);
    return false;
  };

  const handleCloseModal = () => {
    setErrors({});
    setSubmitError(null);
    handleClose();
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // 3. Directly trigger update mutation
    await updateTask(currentTask); // ✅ correct usage
      handleCloseModal();
    } catch (err) {
      const apiError = err as { response?: { data?: { message?: string } } };
      setSubmitError(
        apiError?.response?.data?.message ?? "Something went wrong while updating."
      );
    }
  };

  return (
    <CommonModal 
      isOpen={isModalOpen} 
      title="Modify Task Details" 
      onClose={handleCloseModal} 
      position="right" 
      height="full"
    >
      <form onSubmit={handleUpdateTask} className="space-y-4">
        {submitError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs font-medium">
            ⚠️ {submitError}
          </div>
        )}

        {/* Task Title Field */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
            Task Title *
          </label>
          <Inputecommone
            type="text"
            name="task-title"
            placeholder="e.g. Redesign Landing Page"
            value={currentTask.title}
            onChange={(e) => {
              setCurrentTask({ ...currentTask, title: e.target.value });
              if (errors.title) setErrors({ ...errors, title: "" });
            }}
          />
          {errors.title && <p className="text-xs text-red-500 font-medium mt-1">{errors.title}</p>}
        </div>

        {/* Description Field */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
            Description
          </label>
          <textarea
            rows={3}
            value={currentTask.description}
            onChange={(e) => {
              setCurrentTask({ ...currentTask, description: e.target.value });
              if (errors.description) setErrors({ ...errors, description: "" });
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
            placeholder="Detailed scopes..."
          />
          {errors.description && <p className="text-xs text-red-500 font-medium mt-1">{errors.description}</p>}
        </div>

        {/* Status, Due Date, and Task Owner Row Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
              Status
            </label>
            <select
              value={currentTask.status}
              onChange={(e) => setCurrentTask({ ...currentTask, status: e.target.value as TaskForm["status"] })}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="PENDING">To Do (Pending)</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
              Due Date *
            </label>
            <Inputecommone
              type="date"
              name="due-date"
              placeholder="Select Due Date"
              value={currentTask.dueDate ? currentTask.dueDate.split("T")[0] : ""}
              onChange={(e) => {
                setCurrentTask({ ...currentTask, dueDate: e.target.value });
                if (errors.dueDate) setErrors({ ...errors, dueDate: "" });
              }}
            />
            {errors.dueDate && <p className="text-xs text-red-500 font-medium mt-1">{errors.dueDate}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
              Assign Owner *
            </label>
            <select
              value={currentTask.ownerId}
              onChange={(e) => {
                setCurrentTask({ ...currentTask, ownerId: e.target.value });
                if (errors.ownerId) setErrors({ ...errors, ownerId: "" });
              }}
              disabled={isLoadingUsers}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white disabled:bg-gray-100"
            >
              <option value="">{isLoadingUsers ? "Loading users..." : "-- Select Owner --"}</option>
              {users?.map((user: User) => (
                <option key={user.id} value={user.id}>
                  {user.firstname} 
                </option>
              ))}
            </select>
            {errors.ownerId && <p className="text-xs text-red-500 font-medium mt-1">{errors.ownerId}</p>}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-gray-100 flex justify-end space-x-3">
          <Button Onclick={handleCloseModal} btname="Cancel" btcolor="bg-gray-100" btstyle="text-gray-700 hover:bg-gray-200" />
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? "Updating..." : "Save Modifications"}
          </button>
        </div>
      </form>
    </CommonModal>
  );
};