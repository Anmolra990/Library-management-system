import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute() {
  const { user } = useAuth();

  console.log("Current user:", user);
  console.log("Current role:", user?.role);

  const role = String(user?.role ?? "").trim().toLowerCase();

  return role === "admin" ? (
    <Outlet />
  ) : (
    <Navigate to="/" replace />
  );
}