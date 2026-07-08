import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import authFetch from "./authFetch";

export const useAuth = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await authFetch.get("/auth/me");
      localStorage.setItem("Utype", res.data.user.role);
      localStorage.setItem("OwId", res.data.user.id);
      localStorage.setItem("username", res.data.user.firstname);
      return res.data;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: true,
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
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};

export const userLogin = (credentials: LoginCredentials) => {
  return authFetch.post<AuthResponse>("/auth/login", credentials);
}