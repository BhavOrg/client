import { createBrowserRouter, Navigate, Outlet } from "react-router";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";

// Create a Protected Route component that checks auth status
const ProtectedRoute = () => {
  // We'll use localStorage directly here since the useAuth hook
  // can only be used inside components rendered by React
  const isAuthenticated = !!localStorage.getItem("token");

  if (!isAuthenticated) {
    // Redirect to home if not authenticated
    return <Navigate to="/" replace />;
  }

  // Otherwise, render the children routes
  return <Outlet />;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      // Public routes
      {
        path: "blogs",
        element: <div>Blogs Page</div>,
      },
      {
        path: "community",
        element: <div>Community Page</div>,
      },
      {
        path: "contact",
        element: <div>Contact Page</div>,
      },

      // Protected routes that require authentication
      {
        path: "feed",
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <div>Feed Page</div>,
          },
        ],
      },
      {
        path: "profile",
        element: <ProtectedRoute />,
        children: [
          {
            index: true,
            element: <div>Profile Page</div>,
          },
        ],
      },

      // Catch-all route for 404
      {
        path: "*",
        element: <div>Page Not Found</div>, // Replace with your 404 page
      },
    ],
  },
]);
