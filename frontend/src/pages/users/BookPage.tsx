import axios from "axios";
import { useEffect, useMemo, useState } from "react";

import { getAllBooks } from "../../api/book.api";
import { BorrowingAPI } from "../../api/borrowing.api";

import type { Book } from "../../types/books";

export default function BookPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [borrowingId, setBorrowingId] = useState<number | null>(
    null
  );
  const [message, setMessage] = useState("");

  const loadBooks = async () => {
    try {
      setLoading(true);

      const data = await getAllBooks();

      setBooks(data);
    } catch {
      setMessage("Unable to load books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadBooks();
  }, []);

  const categories = useMemo(() => {
    const values = books
      .map((book) => book.category)
      .filter(Boolean) as string[];

    return ["All", ...new Set(values)];
  }, [books]);

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        book.title.toLowerCase().includes(searchText) ||
        book.author.toLowerCase().includes(searchText);

      const matchesCategory =
        category === "All" ||
        book.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [books, search, category]);

  const handleBorrow = async (bookId: number) => {
    setMessage("");
    setBorrowingId(bookId);

    try {
      await BorrowingAPI.create(bookId);

      setMessage("Book borrowed successfully");

      await loadBooks();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setMessage(
          error.response?.data?.message ||
            `Unable to borrow this book (${error.response?.status ?? "network error"})`
        );
      } else {
        setMessage(
          error instanceof Error
            ? error.message
            : "Unable to borrow this book"
        );
      }
    } finally {
      setBorrowingId(null);
    }
  };

  return (
    <main className="space-y-8">
      <section className="rounded-[2rem] bg-slate-950 p-7 text-white shadow-xl sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-sky-300">
          Library collection
        </p>

        <h1 className="display-font mt-3 text-4xl leading-tight sm:text-5xl">
          Find your next great book
        </h1>

        <p className="mt-3 max-w-xl leading-7 text-slate-300">
          Browse our collection, search by title or author,
          and borrow books instantly.
        </p>

        <div className="mt-7 flex flex-col gap-3 md:flex-row">
          <input
            type="text"
            placeholder="Search by title or author..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            className="w-full rounded-xl border border-white/10 bg-white px-4 py-3 text-slate-800 outline-none placeholder:text-slate-400 focus:ring-4 focus:ring-sky-300/30 md:max-w-lg"
          />

          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value)
            }
            className="rounded-xl bg-white px-4 py-3 text-slate-800 outline-none focus:ring-4 focus:ring-sky-300/30"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </section>

      {message && (
        <div role="status" className="rounded-xl border border-sky-200 bg-sky-50 p-4 font-medium text-sky-700">
          {message}
        </div>
      )}

      <section>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Available books
            </h2>

            <p className="text-slate-500">
              {filteredBooks.length} books found
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-96 animate-pulse rounded-2xl bg-slate-200"
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBooks.map((book) => {
              const isUnavailable =
                book.availableCopies <= 0;

              const isInactive =
                book.status?.toLowerCase() === "inactive";

              const percentage =
                book.totalCopies > 0
                  ? (book.availableCopies /
                      book.totalCopies) *
                    100
                  : 0;

              return (
                <article
                  key={book.id}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-xl"
                >
                  <div className="relative flex h-48 items-center justify-center overflow-hidden bg-slate-900">
                    {book.imageUrl || book.image_url ? (
                      <img
                        src={book.imageUrl || book.image_url}
                        alt={`${book.title} cover`}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="display-font text-7xl text-sky-300 transition duration-300 group-hover:scale-110">
                        {book.title.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-indigo-700">
                      {book.category || "General"}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="line-clamp-1 text-xl font-bold text-slate-900">
                      {book.title}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Written by {book.author}
                    </p>

                    <p className="mt-4 text-sm text-slate-600">
                      ISBN: {book.isbn ?? book.ISBN ?? "Not available"}
                    </p>

                    <div className="mt-5">
                      <div className="mb-2 flex justify-between text-sm">
                        <span className="text-slate-500">
                          Availability
                        </span>

                        <span className="font-semibold text-slate-800">
                          {book.availableCopies}/
                          {book.totalCopies}
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className={`h-full rounded-full ${isUnavailable ? "bg-rose-500" : "bg-sky-500"}`}
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>
                    </div>

                    <button
                      disabled={
                        isUnavailable ||
                        isInactive ||
                        borrowingId === book.id
                      }
                      onClick={() =>
                        void handleBorrow(book.id)
                      }
                      className="mt-5 w-full rounded-xl bg-slate-900 py-3 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                      {borrowingId === book.id
                        ? "Borrowing..."
                        : isInactive
                        ? "Inactive"
                        : isUnavailable
                        ? "Unavailable"
                        : "Borrow this book"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {!loading && filteredBooks.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
            <p className="text-lg font-semibold text-slate-700">
              No books found
            </p>

            <p className="mt-2 text-slate-500">
              Try another title, author, or category.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}