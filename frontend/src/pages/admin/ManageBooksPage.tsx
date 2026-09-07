import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  deleteBook,
  getAllBooks,
} from "../../api/book.api";

import type { Book } from "../../types/books";

export default function ManageBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);

  const loadBooks = async () => {
    const data = await getAllBooks();
    setBooks(data);
  };

  useEffect(() => {
    void loadBooks();
  }, []);

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Delete this book?"
    );

    if (!confirmed) return;

    await deleteBook(id);
    await loadBooks();
  };

  return (
    <section>
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">
          Manage Books
        </h1>

        <Link
          to="/admin/books/add"
          className="rounded bg-indigo-600 px-4 py-2 text-white"
        >
          Add Book
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl bg-white shadow">
        <table className="w-full text-left">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4">Title</th>
              <th className="p-4">Author</th>
              <th className="p-4">Available</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {books.map((book) => (
              <tr key={book.id} className="border-t">
                <td className="p-4">{book.title}</td>
                <td className="p-4">{book.author}</td>
                <td className="p-4">
                  {book.availableCopies}
                </td>

                <td className="flex gap-2 p-4">
                  <Link
                    to={`/admin/books/${book.id}/edit`}
                    className="rounded bg-yellow-500 px-3 py-2 text-white"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() =>
                      void handleDelete(book.id)
                    }
                    className="rounded bg-red-600 px-3 py-2 text-white"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}