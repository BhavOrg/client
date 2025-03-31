import { createBrowserRouter, Navigate, Outlet } from "react-router";
import MainLayout from "../layouts/MainLayout";
import FeedLayout from "../layouts/FeedLayout";
import HomePage from "../pages/Home/Home";
import FeedPage from "../pages/Feed/FeedPage";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Create a Protected Route component that checks auth status
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("token");

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export const router = createBrowserRouter([
  // Main public routes with MainLayout
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      // Other public routes
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
      // Profile route with authentication
      {
        path: "profile",
        element: <ProtectedRoute children={undefined} />,
        children: [
          {
            index: true,
            element: <div>Profile Page</div>,
          },
        ],
      },
      // Catch-all route
      {
        path: "*",
        element: <div>Page Not Found</div>,
      },
    ],
  },
  // Feed-specific routes with FeedLayout
  {
    path: "/feed",
    element: (
      <ProtectedRoute>
        <FeedLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <FeedPage />,
      },
    ],
  },
]);
