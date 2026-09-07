import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <section>
      <h1 className="text-3xl font-bold">
        Admin Dashboard
      </h1>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <Link
          to="/admin/books"
          className="rounded-xl bg-white p-6 shadow"
        >
          <h2 className="text-xl font-bold">
            Manage Books
          </h2>
        </Link>

        <Link
          to="/admin/borrowings"
          className="rounded-xl bg-white p-6 shadow"
        >
          <h2 className="text-xl font-bold">
            View Borrowings
          </h2>
        </Link>
      </div>
    </section>
  );
}