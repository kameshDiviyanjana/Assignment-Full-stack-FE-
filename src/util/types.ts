
export interface Task {
  id: string;
  title: string;
  description: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  dueDate: string;
  ownerId: string;

  owner?: {
    firstname: string;
    lastname: string;
  };

  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";


export interface UseTasksParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: TaskStatus;
  userId?: string;
}


export interface AdminAllUserParams {
  page?: number;
  limit?: number;
  search?: string;
}



export interface UpdateUserPayload {
  firstname: string;
  lastname?: string;
  email?: string;
}

export interface UpdateStatusArgs {
  id: string;
  isActive: boolean; // assuming your status field evaluates as a boolean or string flag
}