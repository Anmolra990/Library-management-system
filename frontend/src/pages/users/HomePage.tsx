import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <section>
      <h1 className="text-3xl font-bold">
        Welcome, {user?.name}
      </h1>

      <p className="mt-2 text-slate-600">
        Manage your books and borrowing history.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Link
          to="/books"
          className="rounded-xl bg-indigo-600 p-6 text-white shadow"
        >
          <h2 className="text-xl font-bold">
            Browse Books
          </h2>

          <p className="mt-2">
            View available books and borrow one.
          </p>
        </Link>

        <Link
          to="/my-borrowings"
          className="rounded-xl bg-emerald-600 p-6 text-white shadow"
        >
          <h2 className="text-xl font-bold">
            My Borrowings
          </h2>

          <p className="mt-2">
            View your borrowed books and return them.
          </p>
        </Link>
      </div>
    </section>
  );
}