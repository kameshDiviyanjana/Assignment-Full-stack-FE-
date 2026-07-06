import { z } from "zod";

export const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Task title must be at least 3 characters")
    .max(100, "Task title cannot exceed 100 characters"),

  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),

  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]),

 ownerId: z.string().min(1, "Please assign a valid task owner"), 


    dueDate: z
  .string()
  .min(1, "Due date is required")
  .refine(
    (date) => {
      const selected = new Date(date);
      selected.setHours(0, 0, 0, 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return selected >= today;
    },
    {
      message: "Due date cannot be in the past",
    }
  ),
});


export const registerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters."),
  lastName: z.string().min(1, "Last name is required."),
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});