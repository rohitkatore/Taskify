import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import "./styles/background.css"; // Import the new background styles
import Layout from "./components/Layout";
import { useUser } from "./context/UserContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import ProjectDetails from "./pages/ProjectDetails";
import { useToast } from "./context/ToastContext";
import { useEffect } from "react";

function App() {
  const { loading, user } = useUser();
  const { showToast } = useToast();

  useEffect(() => {
    // Welcome toast for first-time visitors
    const hasVisited = localStorage.getItem("hasVisited");
    if (!hasVisited) {
      const timer = setTimeout(() => {
        showToast("Welcome to the Project Management System!", "info");
        localStorage.setItem("hasVisited", "true");
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center">
          <svg
            className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-gray-600">Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="projects/:projectId"
          element={
            <ProtectedRoute>
              <ProjectDetails />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="login" element={!user ? <Login /> : <Navigate to="/" />} />
      <Route
        path="register"
        element={!user ? <Register /> : <Navigate to="/" />}
      />
    </Routes>
  );
}

export default App;
