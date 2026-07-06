import { describe, it, expect } from "vitest";
import { taskSchema, registerSchema } from "./Formvalidation";

describe("taskSchema", () => {
  const getFutureDate = (daysAhead = 1): string => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    return d.toISOString().split("T")[0];
  };

  const getPastDate = (daysAgo = 1): string => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().split("T")[0];
  };

  it("should validate a correct task payload", () => {
    const validTask = {
      title: "Develop features",
      description: "Implement automated unit testing",
      status: "PENDING" as const,
      ownerId: "user-123",
      dueDate: getFutureDate(2),
    };

    const result = taskSchema.safeParse(validTask);
    expect(result.success).toBe(true);
  });

  it("should allow empty/optional description", () => {
    const validTask = {
      title: "Write documentation",
      status: "IN_PROGRESS" as const,
      ownerId: "user-456",
      dueDate: getFutureDate(0), // Today is valid
    };

    const result = taskSchema.safeParse(validTask);
    expect(result.success).toBe(true);
  });

  it("should fail validation if title is too short", () => {
    const invalidTask = {
      title: "Ab",
      status: "COMPLETED" as const,
      ownerId: "user-123",
      dueDate: getFutureDate(2),
    };

    const result = taskSchema.safeParse(invalidTask);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Task title must be at least 3 characters");
    }
  });

  it("should fail validation if status is invalid", () => {
    const invalidTask = {
      title: "Write code",
      status: "NOT_STARTED", // Invalid enum value
      ownerId: "user-123",
      dueDate: getFutureDate(2),
    };

    const result = taskSchema.safeParse(invalidTask);
    expect(result.success).toBe(false);
  });

  it("should fail validation if dueDate is in the past", () => {
    const invalidTask = {
      title: "Complete tasks",
      status: "COMPLETED" as const,
      ownerId: "user-123",
      dueDate: getPastDate(1),
    };

    const result = taskSchema.safeParse(invalidTask);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Due date cannot be in the past");
    }
  });
});

describe("registerSchema", () => {
  it("should validate a correct registration payload", () => {
    const validRegistration = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password123",
    };

    const result = registerSchema.safeParse(validRegistration);
    expect(result.success).toBe(true);
  });

  it("should fail validation if firstName is too short", () => {
    const invalidRegistration = {
      firstName: "J",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password123",
    };

    const result = registerSchema.safeParse(invalidRegistration);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("First name must be at least 2 characters.");
    }
  });

  it("should fail validation if email format is invalid", () => {
    const invalidRegistration = {
      firstName: "John",
      lastName: "Doe",
      email: "not-an-email",
      password: "password123",
    };

    const result = registerSchema.safeParse(invalidRegistration);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Invalid email address.");
    }
  });

  it("should fail validation if password is too short", () => {
    const invalidRegistration = {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "123",
    };

    const result = registerSchema.safeParse(invalidRegistration);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("Password must be at least 6 characters.");
    }
  });
});
