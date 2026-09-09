import { useNavigate } from "react-router-dom";
import { createBook } from "../../api/book.api";
import BookForm from "../../components/BookForm";
import type { BookInput } from "../../types/books";

export default function AddBookPage() {
  const navigate = useNavigate();

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add book</h1>
        <p className="mt-2 text-sm text-slate-500">Add catalogue details and an optional cover image.</p>
      </div>
      <BookForm
        submitLabel="Add book"
        onCancel={() => navigate("/admin/books")}
        onSubmit={async (values: BookInput) => {
          await createBook(values);
          navigate("/admin/books");
        }}
      />
    </section>
  );
}