import { Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from './page/LoginPage'
import { TaskManagerPage } from './page/TaskManagerPage';
import { ProtectedRoute } from './componentes/ProtectedRoute';
import { Registercomponente } from './componentes/Registercomponente';
import { useAuth } from './api/aut.api';
import { isTokenValid } from './api/tokenUtils';
import { AdminAllUsersPage } from "./page/AdminAllusePage";

function App() {
  const { data: user, isLoading, isError } = useAuth();
  const hasValidToken = isTokenValid();

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

  const isAuthenticated = hasValidToken && user && !isError;

  return (
    <Routes>
      <Route
        path="/"
        element={<LoginPage />}
      />

      <Route
        path="/register"
        element={<Registercomponente />}
      />

      <Route
        path="/tasks"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
            <TaskManagerPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/all-users"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading}>
            <AdminAllUsersPage />
          </ProtectedRoute>
        }
      />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
