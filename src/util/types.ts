
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