import { createBrowserRouter, Navigate, Outlet } from "react-router";
import MainLayout from "../layouts/MainLayout";
import FeedLayout from "../layouts/FeedLayout";
import HomePage from "../pages/Home/Home";
import FeedPage from "../pages/Feed/FeedPage";
import CommunityPage from "../pages/Community/CommunityPage";
import BlogPage from "../pages/Blog/BlogPage";
import ContactPage from "../pages/Contact/ContactPage";

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
        element: <BlogPage />,
      },
      {
        path: "community",
        element: <CommunityPage />,
      },
      {
        path: "contact",
        element: <ContactPage />,
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
