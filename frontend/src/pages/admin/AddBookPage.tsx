import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { createBook } from "../../api/book.api";

export default function AddBookPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "",
    description: "",
    totalCopies: 1,
    availableCopies: 1,
  });

  const submit = async (event: FormEvent) => {
    event.preventDefault();

    await createBook(form);
    navigate("/admin/books");
  };

  return (
    <section>
      <h1 className="mb-6 text-3xl font-bold">
        Add Book
      </h1>

      <form
        onSubmit={submit}
        className="max-w-xl space-y-4 rounded-xl bg-white p-6 shadow"
      >
        <input
          required
          placeholder="Title"
          value={form.title}
          onChange={(event) =>
            setForm({
              ...form,
              title: event.target.value,
            })
          }
          className="w-full rounded border p-3"
        />

        <input
          required
          placeholder="Author"
          value={form.author}
          onChange={(event) =>
            setForm({
              ...form,
              author: event.target.value,
            })
          }
          className="w-full rounded border p-3"
        />

        <input
          required
          placeholder="ISBN"
          value={form.isbn}
          onChange={(event) =>
            setForm({
              ...form,
              isbn: event.target.value,
            })
          }
          className="w-full rounded border p-3"
        />

        <input
          required
          placeholder="Category"
          value={form.category}
          onChange={(event) =>
            setForm({
              ...form,
              category: event.target.value,
            })
          }
          className="w-full rounded border p-3"
        />

        <input
          type="number"
          min="0"
          required
          placeholder="Total copies"
          value={form.totalCopies}
          onChange={(event) =>
            setForm({
              ...form,
              totalCopies: Number(event.target.value),
            })
          }
          className="w-full rounded border p-3"
        />

        <input
          type="number"
          min="0"
          required
          placeholder="Available copies"
          value={form.availableCopies}
          onChange={(event) =>
            setForm({
              ...form,
              availableCopies: Number(
                event.target.value
              ),
            })
          }
          className="w-full rounded border p-3"
        />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(event) =>
            setForm({
              ...form,
              description: event.target.value,
            })
          }
          className="w-full rounded border p-3"
        />

        <button className="rounded bg-indigo-600 px-5 py-2 text-white">
          Add Book
        </button>
      </form>
    </section>
  );
}