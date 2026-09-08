import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { bookApi } from "../../api/book.api";
import { borrowingApi } from "../../api/borrowing.api";
import LoadingSpinner from "../../components/LoadingSpinner";
import type { Book } from "../../types/books";
import type { Borrowing } from "../../types/borrowing";

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : dateFormatter.format(date);
}

function bookTitle(row: Borrowing) {
  return row.Book?.title ?? row.book?.title ?? row.title ?? `Book #${row.bookId ?? "—"}`;
}

function borrowingDate(row: Borrowing) {
  return row.borrowedAt ?? row.borrowDate ?? row.borrowed_date ?? row.createdAt;
}

function statusOf(row: Borrowing) {
  return row.status?.toUpperCase() === "RETURNED" || row.returnedAt || row.returned_date
    ? "Returned"
    : "Active";
}

export default function AdminDashboard() {
  const [books, setBooks] = useState<Book[]>([]);
  const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [bookData, borrowingData] = await Promise.all([
          bookApi.getAll(),
          borrowingApi.getAll(),
        ]);
        setBooks(bookData);
        setBorrowings(borrowingData);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Could not load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    void loadDashboard();
  }, []);

  const stats = useMemo(() => {
    const totalCopies = books.reduce((sum, book) => sum + Number(book.totalCopies || 0), 0);
    const availableCopies = books.reduce((sum, book) => sum + Number(book.availableCopies || 0), 0);
    const activeBorrowings = borrowings.filter((row) => statusOf(row) === "Active").length;
    const returnedBorrowings = borrowings.filter((row) => statusOf(row) === "Returned").length;
    const lowStockBooks = books.filter((book) => Number(book.availableCopies) === 0 || Number(book.availableCopies) <= Math.max(1, Math.floor(Number(book.totalCopies || 0) * 0.2))).length;

    return { totalTitles: books.length, totalCopies, availableCopies, activeBorrowings, returnedBorrowings, lowStockBooks };
  }, [books, borrowings]);

  const recentBooks = useMemo(() => {
    return [...books]
      .sort((first, second) => new Date(second.createdAt ?? 0).getTime() - new Date(first.createdAt ?? 0).getTime())
      .slice(0, 5);
  }, [books]);

  const recentBorrowings = borrowings.slice(0, 5);

  if (loading) return <LoadingSpinner />;

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Administration</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Good morning, admin</h1>
          <p className="mt-2 text-sm text-slate-500">Here is what is happening in your library today.</p>
        </div>
        <Link to="/admin/books/add" className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700">+ Add a book</Link>
      </div>

      {error && <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-600 to-indigo-700 p-5 text-white shadow-lg shadow-indigo-100">
          <div className="flex items-start justify-between"><p className="text-sm text-indigo-100">Book titles</p><span className="rounded-xl bg-white/15 px-2.5 py-1 text-lg" aria-hidden="true">▤</span></div>
          <p className="mt-5 text-3xl font-bold">{stats.totalTitles}</p>
          <p className="mt-1 text-xs text-indigo-100">{stats.totalCopies} total copies</p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-500 to-teal-600 p-5 text-white shadow-lg shadow-emerald-100">
          <div className="flex items-start justify-between"><p className="text-sm text-emerald-50">Available copies</p><span className="rounded-xl bg-white/15 px-2.5 py-1 text-lg" aria-hidden="true">✓</span></div>
          <p className="mt-5 text-3xl font-bold">{stats.availableCopies}</p>
          <p className="mt-1 text-xs text-emerald-50">Ready to be borrowed</p>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-400 to-orange-500 p-5 text-white shadow-lg shadow-amber-100">
          <div className="flex items-start justify-between"><p className="text-sm text-amber-50">Active borrowings</p><span className="rounded-xl bg-white/15 px-2.5 py-1 text-lg" aria-hidden="true">↗</span></div>
          <p className="mt-5 text-3xl font-bold">{stats.activeBorrowings}</p>
          <p className="mt-1 text-xs text-amber-50">Currently with users</p>
        </div>
        <div className="rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-500 to-pink-600 p-5 text-white shadow-lg shadow-rose-100">
          <div className="flex items-start justify-between"><p className="text-sm text-rose-50">Low-stock titles</p><span className="rounded-xl bg-white/15 px-2.5 py-1 text-lg" aria-hidden="true">!</span></div>
          <p className="mt-5 text-3xl font-bold">{stats.lowStockBooks}</p>
          <p className="mt-1 text-xs text-rose-50">Need your attention</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_1fr]">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 p-5">
            <div><h2 className="font-semibold text-slate-900">Recently added books</h2><p className="mt-1 text-xs text-slate-500">Your latest collection updates</p></div>
            <Link to="/admin/books" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">View all</Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentBooks.map((book) => {
              const percentage = Number(book.totalCopies) > 0 ? Math.round((Number(book.availableCopies) / Number(book.totalCopies)) * 100) : 0;
              return (
                <div key={book.id} className="flex items-center gap-3 p-4 sm:p-5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 font-bold text-sky-700" aria-hidden="true">{book.title.charAt(0).toUpperCase()}</div>
                  <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-900">{book.title}</p><p className="mt-0.5 truncate text-xs text-slate-500">by {book.author}</p></div>
                  <div className="hidden w-28 sm:block"><div className="flex justify-between text-[11px] text-slate-500"><span>Stock</span><span>{book.availableCopies}/{book.totalCopies}</span></div><div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${percentage <= 20 ? "bg-rose-500" : "bg-emerald-500"}`} style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }} /></div></div>
                  <Link to={`/admin/books/${book.id}/edit`} className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50">Edit</Link>
                </div>
              );
            })}
            {!recentBooks.length && <p className="p-6 text-sm text-slate-500">No books have been added yet.</p>}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 p-5">
            <div><h2 className="font-semibold text-slate-900">Recent borrowing activity</h2><p className="mt-1 text-xs text-slate-500">Latest user activity</p></div>
            <Link to="/admin/borrowings" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">View all</Link>
          </div>
          <div className="divide-y divide-slate-100">
            {recentBorrowings.map((row) => (
              <div key={row.id} className="flex items-center gap-3 p-4 sm:p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-50 font-bold text-violet-700" aria-hidden="true">{bookTitle(row).charAt(0).toUpperCase()}</div>
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-900">{bookTitle(row)}</p><p className="mt-0.5 text-xs text-slate-500">{formatDate(borrowingDate(row))}</p></div>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusOf(row) === "Returned" ? "bg-emerald-50 text-emerald-700" : "bg-indigo-50 text-indigo-700"}`}>{statusOf(row)}</span>
              </div>
            ))}
            {!recentBorrowings.length && <p className="p-6 text-sm text-slate-500">No borrowing activity yet.</p>}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Link to="/admin/books" className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 font-bold text-indigo-700" aria-hidden="true">B</span><h2 className="mt-3 font-semibold text-slate-900">Manage collection</h2><p className="mt-1 text-sm text-slate-500">Edit details, stock, or remove old books.</p><span className="mt-4 inline-block text-sm font-semibold text-indigo-600 group-hover:text-indigo-700">Open books →</span></Link>
        <Link to="/admin/books/add" className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 font-bold text-emerald-700" aria-hidden="true">+</span><h2 className="mt-3 font-semibold text-slate-900">Add a new book</h2><p className="mt-1 text-sm text-slate-500">Grow the collection with a new title.</p><span className="mt-4 inline-block text-sm font-semibold text-emerald-600 group-hover:text-emerald-700">Create book →</span></Link>
        <Link to="/admin/borrowings" className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-md"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 font-bold text-amber-700" aria-hidden="true">R</span><h2 className="mt-3 font-semibold text-slate-900">Review borrowings</h2><p className="mt-1 text-sm text-slate-500">Track users, due dates, and returns.</p><span className="mt-4 inline-block text-sm font-semibold text-amber-600 group-hover:text-amber-700">View activity →</span></Link>
      </div>

      <p className="text-xs text-slate-400">{stats.returnedBorrowings} borrowing records have been returned.</p>
    </section>
  );
}
