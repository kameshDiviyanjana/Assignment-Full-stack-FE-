import { useState } from "react";
import { Inputecommone } from "../atomes/Inputecommone";
import { Button } from "../atomes/Button";
import { CommonModal } from "../atomes/CommonModal";
import { taskSchema } from "../util/Formvalidation";
import { useAdminAllUsers, useCreateTask } from "../api/api.task";

interface User {
  id: string;
  firstname: string;
}

interface Task {
  id?: string;
  title: string;
  description: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  dueDate: string;
  ownerId: string;
}

type Taskprops = {
  isModalOpen: boolean;
  handleClose(): void;
  initialTask?: Task | null;
  onSave?: (task: Task) => Promise<void>;
};

const defaultTask: Task = {
  title: "",
  description: "",
  status: "PENDING",
  dueDate: "",
  ownerId: "",
};

export const Taskcreatecomponente: React.FC<Taskprops> = ({
  isModalOpen,
  handleClose,
  initialTask,
}) => {
  const utype = localStorage.getItem("Utype");
  const loggedInUserId = localStorage.getItem("OwId") || "";

  const [currentTask, setCurrentTask] = useState<Task>(initialTask || defaultTask);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { data: users, isLoading: isLoadingUsers } = useAdminAllUsers();
  const { mutateAsync, isPending: isSubmitting } = useCreateTask();

  const [prevProps, setPrevProps] = useState({
    initialTask,
    isModalOpen,
    utype,
    loggedInUserId
  });

  if (
    initialTask !== prevProps.initialTask ||
    isModalOpen !== prevProps.isModalOpen ||
    utype !== prevProps.utype ||
    loggedInUserId !== prevProps.loggedInUserId
  ) {
    setPrevProps({ initialTask, isModalOpen, utype, loggedInUserId });
    if (initialTask) {
      setCurrentTask(initialTask);
    } else {
      setCurrentTask({
        ...defaultTask,
        ownerId: utype !== "ADMIN" ? loggedInUserId : "",
      });
    }
    setErrors({});
    setSubmitError(null);
  }

  const validateForm = () => {
    const taskToValidate = {
      ...currentTask,
      ownerId: utype === "ADMIN" ? currentTask.ownerId : loggedInUserId
    };

    const result = taskSchema.safeParse(taskToValidate);

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
    setCurrentTask(defaultTask);
    setErrors({});
    setSubmitError(null);
    handleClose();
  };

  const handleSaveTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const finalTaskPayload = {
      ...currentTask,
      ownerId: utype === "ADMIN" ? currentTask.ownerId : loggedInUserId
    };

    try {
      await mutateAsync(finalTaskPayload);
      handleCloseModal();
    } catch (err) {
      const apiError = err as { response?: { data?: { message?: string } } };
      setSubmitError(
        apiError?.response?.data?.message ?? "An unexpected server error occurred."
      );
    }
  };

  const modalTitle = currentTask.id ? "Edit Task Details" : "Create New Task";

  return (
    <CommonModal isOpen={isModalOpen} title={modalTitle} onClose={handleCloseModal} position="right">
      <form onSubmit={handleSaveTask} className="flex flex-col h-full max-w-xl mx-auto space-y-6 px-1 py-2">

        {submitError && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl animate-fade-in">
            <span className="text-base mt-0.5">⚠️</span>
            <div className="text-sm">
              <p className="font-semibold text-red-800">Submission Failed</p>
              <p className="text-xs text-red-600 mt-0.5">{submitError}</p>
            </div>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
            Task Title <span className="text-red-500">*</span>
          </label>
          <Inputecommone
            type="text"
            name="task-title"
            placeholder="e.g. Redesign landing page user experience"
            value={currentTask.title}
            onChange={(e) => {
              setCurrentTask({ ...currentTask, title: e.target.value });
              if (errors.title) setErrors({ ...errors, title: "" });
            }}
          />
          {errors.title && (
            <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-1 pl-1">
              <span>•</span> {errors.title}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
            Description / Scope
          </label>
          <textarea
            rows={4}
            value={currentTask.description}
            onChange={(e) => {
              setCurrentTask({ ...currentTask, description: e.target.value });
              if (errors.description) setErrors({ ...errors, description: "" });
            }}
            className={`w-full px-3.5 py-2.5 border rounded-xl text-sm transition-all outline-none focus:ring-4 focus:ring-indigo-500/10 ${errors.description
              ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
              : "border-gray-300 focus:border-indigo-500"
              }`}
            placeholder="Provide a detailed overview of the core tasks, goals, and required outcomes..."
          />
          {errors.description && (
            <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-1 pl-1">
              <span>•</span> {errors.description}
            </p>
          )}
        </div>

        <div className={`grid grid-cols-1 gap-5 ${utype === "ADMIN" ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
              Pipeline Status
            </label>
            <div className="relative">
              <select
                value={currentTask.status}
                onChange={(e) => setCurrentTask({ ...currentTask, status: e.target.value as Task["status"] })}
                className="w-full pl-3.5 pr-10 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 bg-white appearance-none transition-all cursor-pointer font-medium text-gray-800"
              >
                <option value="PENDING">⏳ To Do (Pending)</option>
                <option value="IN_PROGRESS">🚀 In Progress</option>
                <option value="COMPLETED">✅ Completed</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
              Due Date <span className="text-red-500">*</span>
            </label>
            <Inputecommone
              type="date"
              name="due-date"
              placeholder="Select Target Date"
              value={currentTask.dueDate ? currentTask.dueDate.split("T")[0] : ""}
              onChange={(e) => {
                setCurrentTask({ ...currentTask, dueDate: e.target.value });
                if (errors.dueDate) setErrors({ ...errors, dueDate: "" });
              }}
            />
            {errors.dueDate && (
              <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-1 pl-1">
                <span>•</span> {errors.dueDate}
              </p>
            )}
          </div>

          {utype === "ADMIN" && (
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                Assign Owner <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={currentTask.ownerId}
                  onChange={(e) => {
                    setCurrentTask({ ...currentTask, ownerId: e.target.value });
                    if (errors.ownerId) setErrors({ ...errors, ownerId: "" });
                  }}
                  disabled={isLoadingUsers}
                  className="w-full pl-3.5 pr-10 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 bg-white appearance-none transition-all disabled:bg-gray-50 disabled:text-gray-400 cursor-pointer font-medium text-gray-800"
                >
                  <option value="">{isLoadingUsers ? "Loading user accounts..." : "-- Select User --"}</option>
                  {users?.map((user: User) => (
                    <option key={user.id} value={user.id}>
                      👤 {user.firstname}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
              {errors.ownerId && (
                <p className="text-xs text-red-500 font-medium flex items-center gap-1 mt-1 pl-1">
                  <span>•</span> {errors.ownerId}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="pt-5 border-t border-gray-100 space-x-3 mt-4">
          <Button
            Onclick={handleCloseModal}
            btname="Cancel"
            btcolor="bg-white"
            btstyle="border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold px-5 rounded-xl transition-all h-10"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-10 px-5 mt-5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all w-full  gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Saving...</span>
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </CommonModal>
  );
};