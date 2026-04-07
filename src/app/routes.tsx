import { createBrowserRouter, Navigate } from "react-router";
import Login from "./pages/Login";
import { DashboardLayout } from "./components/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";
import UserManagement from "./pages/UserManagement";
import Reports from "./pages/Reports";
import Betting from "./pages/Betting";
import UserHistory from "./pages/UserHistory";
import TransactionsPage from "./pages/TransactionsPage";
import SettingsPage from "./pages/SettingsPage";
import CashierAnalysis from "./pages/CashierAnalysis";
import ProfilePage from "./pages/ProfilePage";
import ChangePasswordPage from "./pages/ChangePasswordPage";

// Simple auth check - in production this would check real auth state
const isAuthenticated = () => {
  return localStorage.getItem("isLoggedIn") === "true";
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardHome /> },
      { path: "user-management", element: <UserManagement /> },
      { path: "reports", element: <Reports /> },
      { path: "betting", element: <Betting /> },
      { path: "user-history", element: <UserHistory /> },
      { path: "transactions", element: <TransactionsPage /> },
      { path: "cashier-analysis", element: <CashierAnalysis /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "change-password", element: <ChangePasswordPage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);