import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  deleteBook,
  getAllBooks,
} from "../../api/book.api";

import type { Book } from "../../types/books";

export default function ManageBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBooks = async () => {
    try {
      setError("");
      setLoading(true);
      setBooks(await getAllBooks());
    } catch {
      setError("Could not load the book collection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadBooks();
  }, []);

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Delete this book?"
    );

    if (!confirmed) return;

    try {
      await deleteBook(id);
      await loadBooks();
    } catch {
      setError("Could not delete this book.");
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">Collection</p><h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Manage books</h1><p className="mt-2 text-sm text-slate-500">{books.length} titles in your library collection.</p></div>

        <Link
          to="/admin/books/add"
          className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700"
        >
          <span className="mr-2 text-lg leading-none" aria-hidden="true">+</span> Add book
        </Link>
      </div>

      {error && <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? <div className="space-y-3 p-6">{[1, 2, 3, 4].map((item) => <div key={item} className="h-14 animate-pulse rounded-xl bg-slate-100" />)}</div> : books.length === 0 ? <div className="p-12 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-2xl font-bold text-sky-700">+</div><h2 className="mt-4 font-bold text-slate-900">No books yet</h2><p className="mt-2 text-sm text-slate-500">Add the first title to start building the collection.</p><Link to="/admin/books/add" className="mt-5 inline-flex rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white">Add a book</Link></div> : <div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-5 py-4 font-semibold">Book</th>
              <th className="px-5 py-4 font-semibold">Category</th>
              <th className="px-5 py-4 font-semibold">Availability</th>
              <th className="px-5 py-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {books.map((book) => (
              <tr key={book.id} className="transition hover:bg-slate-50">
                <td className="px-5 py-4"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 font-bold text-sky-700" aria-hidden="true">{book.title.charAt(0).toUpperCase()}</span><div><p className="font-semibold text-slate-900">{book.title}</p><p className="mt-0.5 text-xs text-slate-500">by {book.author}</p></div></div></td>
                <td className="px-5 py-4 text-slate-600">{book.category || "General"}</td>
                <td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${book.availableCopies > 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>{book.availableCopies > 0 ? `${book.availableCopies} of ${book.totalCopies} available` : "Unavailable"}</span></td>
                <td className="px-5 py-4 text-right">
                  <Link to={`/admin/books/${book.id}/edit`} className="rounded-lg px-3 py-2 text-sm font-semibold text-sky-700 hover:bg-sky-50">Edit</Link>
                  <button
                    type="button"
                    onClick={() =>
                      void handleDelete(book.id)
                    }
                    className="ml-1 rounded-lg px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table></div>}
      </div>
    </section>
  );
}