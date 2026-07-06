import { useQuery } from "@tanstack/react-query";
import authFetch from "./authFetch"
import axios from "axios";


interface AdminAllUserParams {
  page?: number;
  limit?: number;
  search?: string;
}

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