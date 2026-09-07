import { NavLink, Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="grid gap-6 md:grid-cols-[220px_1fr]">
      <aside className="rounded-xl bg-slate-900 p-4 text-white">
        <h2 className="mb-4 text-xl font-bold">
          Admin Panel
        </h2>

        <div className="flex flex-col gap-3">
          <NavLink to="/admin">Dashboard</NavLink>

          <NavLink to="/admin/books">
            Manage Books
          </NavLink>

          <NavLink to="/admin/borrowings">
            Borrowings
          </NavLink>
        </div>
      </aside>

      <section>
        <Outlet />
      </section>
    </div>
  );
}