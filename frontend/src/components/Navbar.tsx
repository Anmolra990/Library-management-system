import { Link, NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="border-b bg-white shadow-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          to="/"
          className="text-xl font-bold text-indigo-700"
        >
          Library
        </Link>

        <div className="flex items-center gap-3">
          <NavLink to="/books">Books</NavLink>

          <NavLink to="/my-borrowings">
            My Borrowings
          </NavLink>

          <NavLink to="/profile">Profile</NavLink>

          {user?.role === "admin" && (
            <NavLink to="/admin">Admin</NavLink>
          )}

          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="rounded bg-red-600 px-3 py-2 text-white"
          >
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
}