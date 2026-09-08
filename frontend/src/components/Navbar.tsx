import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type NavItem = {
  to: string;
  label: string;
  end?: boolean;
};

const userLinks: NavItem[] = [
  { to: "/books", label: "Browse books" },
  { to: "/my-borrowings", label: "My borrowings" },
  { to: "/profile", label: "Profile" },
];

const adminLinks: NavItem[] = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/books", label: "Manage books" },
  { to: "/admin/books/add", label: "Add book" },
  { to: "/admin/borrowings", label: "Borrowings" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isAdmin = String(user?.role ?? "").toLowerCase() === "admin";
  const isAdminArea = location.pathname.startsWith("/admin");
  const links = isAdmin ? adminLinks : userLinks;

  // Admin pages have their own sidebar in AdminLayout. Do not render the
  // member navbar above it, otherwise users see two different menus together.
  if (isAdminArea) return null;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-xl">
      <nav className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link to={isAdmin ? "/admin" : "/"} className="flex items-center gap-3" onClick={() => setMenuOpen(false)}>
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-lg font-bold text-white shadow-sm" aria-hidden="true">L</span>
          <span>
            <span className="block text-lg font-bold tracking-tight text-slate-900">
              {isAdmin ? "Library Admin" : "Library"}
            </span>
            <span className="block text-xs text-slate-500">
              {isAdmin ? "Management console" : "Find your next read"}
            </span>
          </span>
          </Link>

          <button type="button" onClick={() => setMenuOpen((open) => !open)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 md:hidden" aria-expanded={menuOpen} aria-label={menuOpen ? "Close navigation" : "Open navigation"}>
            <span className="text-xl" aria-hidden="true">{menuOpen ? "×" : "☰"}</span>
          </button>
        </div>

        <div className={`${menuOpen ? "flex" : "hidden"} mt-3 flex-col gap-2 border-t border-slate-100 pt-3 md:mt-0 md:flex md:flex-row md:items-center md:justify-end md:border-0 md:pt-0`}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `rounded-xl px-3 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}

          <span className="mx-1 hidden h-7 w-px bg-slate-200 sm:block" aria-hidden="true" />
          <span className="hidden text-xs text-slate-500 md:block">
            {user?.name ?? "Account"}
          </span>
          <button
            type="button"
            onClick={() => { logout(); navigate("/login"); setMenuOpen(false); }}
            className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Sign out
          </button>
        </div>
      </nav>
    </header>
  );
}
