import axios from "axios";
import { isTokenExpired } from "./tokenUtils";

const authFetch = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


authFetch.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  // Check if token exists and is not expired
  if (token && !isTokenExpired(token)) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (token && isTokenExpired(token)) {
    // Token is expired, remove it
    localStorage.removeItem("accessToken");
  }

  return config;
});


authFetch.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          { refreshToken }
        );

        const newAccessToken = res.data.accessToken;

        localStorage.setItem("accessToken", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return authFetch(originalRequest);
      } catch {
        localStorage.clear();
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default authFetch ;