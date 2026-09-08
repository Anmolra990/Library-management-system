import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BorrowingAPI } from "../../api/borrowing.api";
import LoadingSpinner from "../../components/LoadingSpinner";
import type { Book } from "../../types/books";
import type { Borrowing } from "../../types/borrowing";

type Filter = "ALL" | "BORROWED" | "OVERDUE" | "RETURNED";
type BorrowingStatus = Exclude<Filter, "ALL">;
type SortOrder = "newest" | "oldest" | "due-soon";

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

function parseDate(value?: string | null) {
  if (!value) return undefined;

  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T12:00:00`) : new Date(value);
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  const date = parseDate(value);
  if (!date) return "—";
  return Number.isNaN(date.getTime()) ? "—" : dateFormatter.format(date);
}

function getBook(row: Borrowing): Book | undefined {
  const nestedBook = row.Book ?? row.book;

  if (nestedBook) {
    return nestedBook;
  }

  if (!row.title) {
    return undefined;
  }

  return {
    id: row.bookId ?? row.book_id ?? 0,
    title: row.title,
    author: row.author ?? "Unknown author",
    category: row.category,
    isbn: row.isbn,
    ISBN: row.ISBN,
    totalCopies: 0,
    availableCopies: 0,
  };
}

function getBorrowedDate(row: Borrowing) {
  return (
    row.borrowedAt ??
    row.borrowDate ??
    row.borrowed_date ??
    row.createdAt
  );
}
function getStatus(row: Borrowing): BorrowingStatus {
  const status = row.status?.toUpperCase();
  if (status === "RETURNED" || row.returnedAt || row.returnDate) return "RETURNED";

  const due = parseDate(row.dueDate)?.getTime() ?? Number.NaN;
  if (!Number.isNaN(due) && due < Date.now()) return "OVERDUE";
  return "BORROWED";
}

function getFine(row: Borrowing) {
  const fine = Number(row.fine ?? 0);
  return Number.isFinite(fine) ? fine : 0;
}

function getErrorMessage(error: unknown, fallback: string) {
  if (typeof error === "object" && error !== null && "response" in error) {
    const response = error.response;
    if (typeof response === "object" && response !== null && "data" in response) {
      const data = response.data;
      if (typeof data === "object" && data !== null && "message" in data && typeof data.message === "string") {
        return data.message;
      }
    }
  }
  return error instanceof Error ? error.message : fallback;
}

const statusStyles: Record<Filter, { badge: string; dot: string; label: string }> = {
  ALL: { badge: "bg-slate-100 text-slate-700", dot: "bg-slate-400", label: "All" },
  BORROWED: { badge: "bg-indigo-50 text-indigo-700", dot: "bg-indigo-500", label: "Borrowed" },
  OVERDUE: { badge: "bg-rose-50 text-rose-700", dot: "bg-rose-500", label: "Overdue" },
  RETURNED: { badge: "bg-emerald-50 text-emerald-700", dot: "bg-emerald-500", label: "Returned" },
};

function StatusBadge({ status }: { status: Filter }) {
  const style = statusStyles[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${style.badge}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {style.label}
    </span>
  );
}

export default function MyBorrowingsPage() {
  const [rows, setRows] = useState<Borrowing[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionId, setActionId] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("ALL");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadBorrowings = async (showRefreshState = false) => {
    if (showRefreshState) setRefreshing(true);
    else setLoading(true);

    try {
      setError("");
      setRows(await BorrowingAPI.getMine());
    } catch (loadError) {
      setError(getErrorMessage(loadError, "Could not load your borrowing history."));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void loadBorrowings();
  }, []);

  const counts = useMemo<Record<"total" | BorrowingStatus, number>>(() => {
    return rows.reduce(
      (result, row) => {
        result.total += 1;
        result[getStatus(row)] += 1;
        return result;
      },
      { total: 0, BORROWED: 0, OVERDUE: 0, RETURNED: 0 },
    );
  }, [rows]);

  const visibleRows = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = rows.filter((row) => {
      const book = getBook(row);
      const searchableText = [
        book?.title,
        book?.author,
        book?.category,
        book?.isbn,
        book?.ISBN,
        String(row.bookId ?? ""),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesQuery = !normalizedQuery || searchableText.includes(normalizedQuery);
      const matchesFilter = filter === "ALL" || getStatus(row) === filter;
      return matchesQuery && matchesFilter;
    });

    return [...filtered].sort((first, second) => {
      const firstBorrowed = parseDate(getBorrowedDate(first))?.getTime() ?? 0;
      const secondBorrowed = parseDate(getBorrowedDate(second))?.getTime() ?? 0;
      const firstDue = parseDate(first.dueDate)?.getTime() ?? 0;
      const secondDue = parseDate(second.dueDate)?.getTime() ?? 0;

      if (sortOrder === "oldest") return firstBorrowed - secondBorrowed;
      if (sortOrder === "due-soon") return firstDue - secondDue;
      return secondBorrowed - firstBorrowed;
    });
  }, [filter, query, rows, sortOrder]);

  const handleReturn = async (row: Borrowing) => {
    const book = getBook(row);
    const title = book?.title ?? `Book #${row.bookId ?? "unknown"}`;
    if (!window.confirm(`Return “${title}”?`)) return;

    setActionId(row.id);
    setError("");
    setSuccess("");
    try {
      await BorrowingAPI.returnBook(row.id);
      setSuccess(`“${title}” was returned successfully.`);
      await loadBorrowings(true);
    } catch (returnError) {
      setError(getErrorMessage(returnError, "Unable to return this book."));
    } finally {
      setActionId(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <section className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-600 p-6 text-white shadow-xl sm:p-8">
        <div className="relative z-10 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-200">Your library activity</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">My borrowings</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-indigo-100 sm:text-base">
            Keep track of every book you have borrowed, see when it is due, and return it when you are finished.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/books" className="rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-indigo-700 shadow-sm hover:bg-indigo-50">
              Browse more books
            </Link>
            <button
              type="button"
              onClick={() => void loadBorrowings(true)}
              disabled={refreshing}
              className="rounded-xl border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {refreshing ? "Refreshing…" : "Refresh history"}
            </button>
          </div>
        </div>
        <div className="display-font absolute -right-8 -top-12 text-[12rem] leading-none opacity-15" aria-hidden="true">L</div>
        <div className="absolute -bottom-24 right-24 h-56 w-56 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
      </div>

      {error && (
        <div role="alert" className="flex items-start justify-between gap-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          <span>{error}</span>
          <button type="button" onClick={() => setError("")} className="font-bold text-rose-500" aria-label="Dismiss error">×</button>
        </div>
      )}
      {success && (
        <div role="status" className="flex items-start justify-between gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          <span>{success}</span>
          <button type="button" onClick={() => setSuccess("")} className="font-bold text-emerald-500" aria-label="Dismiss success">×</button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total records</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{counts.total}</p>
          <p className="mt-1 text-xs text-slate-400">All your borrowing activity</p>
        </div>
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5 shadow-sm">
          <p className="text-sm font-medium text-indigo-600">Currently borrowed</p>
          <p className="mt-2 text-3xl font-bold text-indigo-800">{counts.BORROWED}</p>
          <p className="mt-1 text-xs text-indigo-500">Books still with you</p>
        </div>
        <div className="rounded-2xl border border-rose-100 bg-rose-50 p-5 shadow-sm">
          <p className="text-sm font-medium text-rose-600">Overdue</p>
          <p className="mt-2 text-3xl font-bold text-rose-800">{counts.OVERDUE}</p>
          <p className="mt-1 text-xs text-rose-500">Please return these soon</p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm">
          <p className="text-sm font-medium text-emerald-600">Returned</p>
          <p className="mt-2 text-3xl font-bold text-emerald-800">{counts.RETURNED}</p>
          <p className="mt-1 text-xs text-emerald-500">Completed borrowings</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <label className="relative block flex-1">
            <span className="sr-only">Search borrowing history</span>
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400" aria-hidden="true">⌕</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by book title, author, category, or ISBN"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            />
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="flex items-center gap-2 text-sm text-slate-500">
              <span className="whitespace-nowrap">Status</span>
              <select value={filter} onChange={(event) => setFilter(event.target.value as Filter)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100">
                <option value="ALL">All statuses</option>
                <option value="BORROWED">Borrowed</option>
                <option value="OVERDUE">Overdue</option>
                <option value="RETURNED">Returned</option>
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-500">
              <span className="whitespace-nowrap">Sort</span>
              <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value as SortOrder)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100">
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="due-soon">Due date</option>
              </select>
            </label>
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-400">Showing {visibleRows.length} of {rows.length} records</p>
      </div>

      {visibleRows.length > 0 ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Book</th>
                  <th className="px-5 py-4 font-semibold">Borrowed on</th>
                  <th className="px-5 py-4 font-semibold">Due date</th>
                  <th className="px-5 py-4 font-semibold">Returned on</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleRows.map((row) => {
                  const book = getBook(row);
                  const status = getStatus(row);
                  const fine = getFine(row);
                  const returned = status === "RETURNED";
                  const isReturning = actionId === row.id;
                  return (
                    <tr key={row.id} className="transition hover:bg-slate-50/80">
                      <td className="px-5 py-4">
                        <div className="flex min-w-[220px] items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 font-bold text-sky-700" aria-hidden="true">{book?.title?.charAt(0).toUpperCase() ?? "B"}</div>
                          <div>
                            <p className="font-semibold text-slate-900">{book?.title ?? `Book #${row.bookId ?? "—"}`}</p>
                            <p className="mt-0.5 text-xs text-slate-500">{book?.author ? `by ${book.author}` : "Library book"}</p>
                            {book?.category && <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-indigo-500">{book.category}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-slate-600">{formatDate(getBorrowedDate(row))}</td>
                      <td className={`whitespace-nowrap px-5 py-4 ${status === "OVERDUE" ? "font-semibold text-rose-600" : "text-slate-600"}`}>{formatDate(row.dueDate)}</td>
                      <td className="whitespace-nowrap px-5 py-4 text-slate-600">{formatDate(row.returnedAt ?? row.returnDate)}</td>
                      <td className="px-5 py-4"><StatusBadge status={status} />{fine > 0 && <p className="mt-1 text-xs text-rose-600">Fine: {currencyFormatter.format(fine)}</p>}</td>
                      <td className="px-5 py-4 text-right">
                        {!returned ? (
                          <button type="button" onClick={() => void handleReturn(row)} disabled={isReturning} className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60">
                            {isReturning ? "Returning…" : "Return book"}
                          </button>
                        ) : <span className="text-xs font-medium text-slate-400">Completed</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-slate-100 md:hidden">
            {visibleRows.map((row) => {
              const book = getBook(row);
              const status = getStatus(row);
              const fine = getFine(row);
              const returned = status === "RETURNED";
              const isReturning = actionId === row.id;
              return (
                <article key={row.id} className="p-4 sm:p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-50 font-bold text-sky-700" aria-hidden="true">{book?.title?.charAt(0).toUpperCase() ?? "B"}</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h2 className="font-semibold text-slate-900">{book?.title ?? `Book #${row.bookId ?? "—"}`}</h2>
                          <p className="mt-0.5 text-xs text-slate-500">{book?.author ? `by ${book.author}` : "Library book"}</p>
                        </div>
                        <StatusBadge status={status} />
                      </div>
                      <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-3 text-sm">
                        <div><dt className="text-xs text-slate-400">Borrowed on</dt><dd className="mt-0.5 font-medium text-slate-700">{formatDate(getBorrowedDate(row))}</dd></div>
                        <div><dt className="text-xs text-slate-400">Due date</dt><dd className={`mt-0.5 font-medium ${status === "OVERDUE" ? "text-rose-600" : "text-slate-700"}`}>{formatDate(row.dueDate)}</dd></div>
                        {returned && <div><dt className="text-xs text-slate-400">Returned on</dt><dd className="mt-0.5 font-medium text-slate-700">{formatDate(row.returnedAt ?? row.returnDate)}</dd></div>}
                        {fine > 0 && <div><dt className="text-xs text-slate-400">Fine</dt><dd className="mt-0.5 font-medium text-rose-600">{currencyFormatter.format(fine)}</dd></div>}
                      </dl>
                      {!returned && <button type="button" onClick={() => void handleReturn(row)} disabled={isReturning} className="mt-4 w-full rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60">{isReturning ? "Returning…" : "Return book"}</button>}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-50 text-2xl font-bold text-sky-700" aria-hidden="true">L</div>
          <h2 className="mt-4 text-lg font-semibold text-slate-900">{rows.length ? "No matching borrowings" : "No borrowing history yet"}</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            {rows.length ? "Try a different search term or status filter." : "Borrow a book from the collection and it will appear here with its dates and status."}
          </p>
          {!rows.length && <Link to="/books" className="mt-5 inline-flex rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">Find a book</Link>}
        </div>
      )}
    </section>
  );
}
