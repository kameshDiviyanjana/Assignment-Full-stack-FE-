import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import authFetch from "./authFetch";
import type { TaskForm } from "../componentes/Taskupdatecomponente";

type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

interface UseTasksParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: TaskStatus;
  userId?: string;
}


export const AdminandUserAllTasks = (params: UseTasksParams = {}) => {
  const { page = 1, limit = 10, search, status } = params;

  return useQuery({
    queryKey: ["tasks", page, limit, search, status],

    queryFn: async () => {
      try {
        const role = localStorage.getItem("Utype");
        const userId = localStorage.getItem("OwId");

        if (role === "ADMIN") {
          const { data } = await authFetch.get("/task", {
            params: { page, limit, search, status },
          });
          return data;
        }

        const { data } = await authFetch.get("/task/user", {
          params: {
            page,
            limit,
            search,
            status,
            userId,
          },
        });

        return data; // ✅ IMPORTANT FIX
      } catch (error) {
        const err = error as { response?: { data?: unknown }; message?: string };
        console.error("API Error:", err?.response?.data || err.message);
        throw error;
      }
    },

    retry: 1,
  });
};



export interface CreateTaskData {
  title: string;
  description?: string;
  status: TaskStatus;
  dueDate: string;
}

// export const createTask = async (taskData: CreateTaskData) => {
//   const { data } = await authFetch.post("/task", taskData);
//   return data;
// };

export const createTask = async (taskData: CreateTaskData) => {
  try {
    const { data } = await authFetch.post("/task", taskData);
    return data;
  } catch (error) {
    const err = error as { response?: { data?: unknown }; message?: string };
    console.error("API Error:", err?.response?.data || err.message);
    throw error; // IMPORTANT → lets React Query handle it
  }
};


export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskData: CreateTaskData) => createTask(taskData),

    onSuccess: () => {
      // Refresh task list after creating a task
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
  });
};



// export const adminAllusers = async () => {

//    return useQuery({
//     queryKey: ["adminAllusers"],
//     queryFn: async () => {
//       const res = await authFetch.get("/user/admin");
//       return data.data;
//     },
   
//   });

// }

export const useAdminAllUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await authFetch.get("/user/admin");

      return data.data; // ✅ IMPORTANT FIX (extract array)
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedTask: TaskForm) => {
      const res = await authFetch.put(
        `/task/${updatedTask.id}`,
        updatedTask
      );
      return res.data;
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });

      queryClient.invalidateQueries({
        queryKey: ["task", variables.id],
      });
    },
  });
};


export const useAndAdminDeleteTask = () => {

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string) => {
      const res = await authFetch.delete(`/task/${taskId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    }
  }
);

}