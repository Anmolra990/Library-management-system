import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { bookApi } from "../../api/book.api";
import LoadingSpinner from "../../components/LoadingSpinner";
import type { BookInput } from "../../types/books";
import BookForm from "../../components/BookForm";

export default function EditBookPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initial, setInitial] = useState<BookInput>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBook = async () => {
      try {
        setError("");
        const book = await bookApi.getById(Number(id));
        setInitial({
  title: book.title,
  author: book.author,
  isbn: book.isbn ?? book.ISBN ?? "",
  category: book.category ?? "",
  description: book.description ?? "",
  totalCopies: Number(
    book.totalCopies ?? book.quantity ?? 0
  ),
  availableCopies: Number(
    book.availableCopies ??
      book.available_quantity ??
      0
  ),
});
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Could not load this book.");
      } finally {
        setLoading(false);
      }
    };

    void loadBook();
  }, [id]);

  if (loading) return <LoadingSpinner />;

  if (error || !initial) {
    return (
      <section className="rounded-2xl border border-rose-200 bg-rose-50 p-6">
        <h1 className="text-lg font-semibold text-rose-800">Unable to load book</h1>
        <p className="mt-2 text-sm text-rose-700">{error || "This book could not be found."}</p>
        <button type="button" onClick={() => navigate("/admin/books")} className="mt-4 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700">Back to books</button>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">Collection</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Edit book</h1>
        <p className="mt-2 text-sm text-slate-500">Update catalogue information and inventory for this title.</p>
      </div>
      <BookForm
        initial={initial}
        submitLabel="Save changes"
        onCancel={() => navigate("/admin/books")}
        onSubmit={async (values) => {
          await bookApi.update(Number(id), values);
          navigate("/admin/books");
        }}
      />
    </section>
  );
}
