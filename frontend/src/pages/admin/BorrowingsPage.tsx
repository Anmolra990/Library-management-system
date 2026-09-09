import { useEffect, useState } from "react";

import {BorrowingAPI } from "../../api/borrowing.api";

import type { Borrowing } from "../../types/borrowing";

export default function BorrowingsPage() {
  const [borrowings, setBorrowings] = useState<
    Borrowing[]
  >([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBorrowings = async () => {
      try {
        setError("");
        setBorrowings(await BorrowingAPI.getAll());
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load borrowing records."
        );
      }
    };

    void loadBorrowings();
  }, []);

  return (
    <section>
      <h1 className="mb-6 text-3xl font-bold">
        All Borrowings
      </h1>

      {error && (
        <div role="alert" className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl bg-white shadow">
        <table className="w-full text-left">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Book</th>
              <th className="p-4">Due Date</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {borrowings.map((borrowing) => {
              const book =
                borrowing.Book ?? borrowing.book;

              const user =
                borrowing.User ?? borrowing.user;

              return (
                <tr
                  key={borrowing.id}
                  className="border-t"
                >
                  <td className="p-4">
                    {borrowing.user_name ?? user?.name ??
                      `User ${borrowing.userId}`}
                  </td>

                  <td className="p-4">
                    {borrowing.title ?? book?.title ??
                      `Book ${borrowing.bookId}`}
                  </td>

                  <td className="p-4">
                    {borrowing.dueDate ?? borrowing.borrowed_date
                      ? new Date(
                          borrowing.dueDate ?? borrowing.borrowed_date ?? ""
                        ).toLocaleDateString()
                      : "—"}
                  </td>

                  <td className="p-4">
                    {borrowing.status}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}