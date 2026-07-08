import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import authFetch from "./authFetch"
import axios from "axios";
import type { AdminAllUserParams, UpdateUserPayload } from "../util/types";




export const AdminAllUser = ({
  page = 1,
  limit = 10,
  search,
}: AdminAllUserParams = {}) => {
  return useQuery({
    queryKey: ["adminAllUsers", page, limit, search],

    queryFn: async () => {
      try {
        const { data } = await authFetch.get("/user", {
          params: {
            page,
            limit,
            search,
          },
        });

        return data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(
            "API Error:",
            error.response?.data?.message || error.message
          );
        } else {
          console.error("Unexpected Error:", error);
        }

        throw error;
      }
    },

    retry: 1,
  });
};





export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateUserPayload;
    }) => {
      const response = await authFetch.put(
        `/user/${id}`,
        payload
      );

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["auth"],
      });

      queryClient.invalidateQueries({
        queryKey: ["me"],

      });
    },

    onError: (error) => {
      console.error("Error updating profile:", error);
    },

  });
};



export const ActiveAndDeactiveUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const token = localStorage.getItem("accessToken");

      const response = await authFetch.put(
        `/user/status/${id}`,
        { isActive },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminAllUsers"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },

    onError: (error) => {
      console.error("Error updating user account status:", error);
      alert("Failed to modify user status state.");
    },
  });
};