import { Navigate } from "react-router-dom";
import { isTokenValid } from "../api/tokenUtils";

export const ProtectedRoute = ({ children, isAuthenticated, isLoading }: { 
  children: React.ReactNode;
  isAuthenticated: boolean;
  isLoading: boolean;
}) => {
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // User is protected only if authenticated
  if (!isAuthenticated || !isTokenValid()) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};