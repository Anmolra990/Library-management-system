import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


const adminLinks = [
  { to: "/admin", label: "Overview", icon: "▦", end: true },
  { to: "/admin/books", label: "Books", icon: "▤" },
  { to: "/admin/books/add", label: "Add book", icon: "+" },
  { to: "/admin/borrowings", label: "Borrowings", icon: "↗" },
];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
    isActive
      ? "bg-white text-indigo-700 shadow-sm"
      : "text-indigo-100 hover:bg-white/10 hover:text-white"
  }`;

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="grid gap-6 lg:grid-cols-[248px_minmax(0,1fr)]">
      <aside className="flex h-fit flex-col overflow-hidden rounded-3xl bg-gradient-to-b from-slate-950 via-indigo-950 to-indigo-900 p-4 text-white shadow-xl lg:sticky lg:top-6">
        <div className="rounded-2xl bg-white/10 p-4">
          <Link to="/admin" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-lg font-bold text-indigo-700 shadow-sm" aria-hidden="true">L</span>
            <span>
              <span className="block text-base font-bold tracking-tight">Library Admin</span>
              <span className="block text-xs text-indigo-200">Management console</span>
            </span>
          </Link>
        </div>

        <p className="px-3 pb-2 pt-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-indigo-300">Workspace</p>
        <nav className="space-y-1" aria-label="Admin navigation">
          {adminLinks.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/10 text-sm" aria-hidden="true">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-indigo-200">Signed in as</p>
          <div className="mt-3 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-400 text-sm font-bold text-white" aria-hidden="true">
              {user?.name?.charAt(0).toUpperCase() ?? "A"}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user?.name ?? "Administrator"}</p>
              <p className="truncate text-xs text-indigo-200">{user?.email ?? "Admin account"}</p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => { logout(); navigate("/login"); }}
          className="mt-4 flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-indigo-100 hover:bg-rose-500/20 hover:text-rose-100"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/10" aria-hidden="true">↪</span>
          Sign out
        </button>
      </aside>

      <section className="min-w-0"><Outlet /></section>
    </div>
  );
}
