import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import authFetch from "./authFetch";

export const useAuth = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await authFetch.get("/auth/me");
      localStorage.setItem("Utype", res.data.user.role); // Store user type in localStorage
      localStorage.setItem("OwId", res.data.user.id); // Store user ID in localStorage
      localStorage.setItem("username", res.data.user.firstname); // Store username in localStorage
      return res.data;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes - keep data fresh without refetching
    gcTime: 10 * 60 * 1000, // 10 minutes - cache time
    enabled: true, // Only run when there's a valid token
  });
};

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface RegisterCredentials {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const res = await authFetch.post<AuthResponse>("/auth/login", credentials);
      return res.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      // Invalidate the auth query to refresh user data
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (credentials: RegisterCredentials) => {
      const res = await authFetch.post<AuthResponse>("/user/register", credentials);
      return res.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      // Invalidate the auth query to refresh user data
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await authFetch.post("/auth/logout");
    },
    onSuccess: () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      // Clear the auth query cache
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};

export const userLogin = (credentials: LoginCredentials) => {
  return authFetch.post<AuthResponse>("/auth/login", credentials);
}