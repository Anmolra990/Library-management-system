import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import ProtectedRoute from "../components/ProtectedRoute";
import AdminRoute from "../components/AdminRoute";

import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";

import HomePage from "../pages/users/HomePage";
import BookPage from "../pages/users/BookPage";
import MyBorrowingsPage from "../pages/users/MyBorrowingPage";
import ProfilePage from "../pages/users/ProfilePage";

import AdminDashboard from "../pages/admin/AdminDashboard";
import ManageBooksPage from "../pages/admin/ManageBooksPage";
import AddBookPage from "../pages/admin/AddBookPage";
import BorrowingsPage from "../pages/admin/BorrowingsPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/register"
        element={<RegisterPage />}
      />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route
            index
            element={<HomePage />}
          />

          <Route
            path="/books"
            element={<BookPage />}
          />

          <Route
            path="/my-borrowings"
            element={<MyBorrowingsPage />}
          />

          <Route
            path="/profile"
            element={<ProfilePage />}
          />

          <Route element={<AdminRoute />}>
            <Route
              path="/admin"
              element={<AdminLayout />}
            >
              <Route
                index
                element={<AdminDashboard />}
              />

              <Route
                path="books"
                element={<ManageBooksPage />}
              />

              <Route
                path="books/add"
                element={<AddBookPage />}
              />

              <Route
                path="borrowings"
                element={<BorrowingsPage />}
              />
            </Route>
          </Route>
        </Route>
      </Route>

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}