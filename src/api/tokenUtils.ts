// Decode and validate JWT token
export const decodeToken = (token: string) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

// Check if token is expired
export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return true;
  }
  // exp is in seconds, convert to milliseconds
  return decoded.exp * 1000 < Date.now();
};

// Check if token exists and is valid
export const isTokenValid = (): boolean => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    return false;
  }
  return !isTokenExpired(token);
};

// Get token from storage
export const getAccessToken = (): string | null => {
  return localStorage.getItem("accessToken");
};




