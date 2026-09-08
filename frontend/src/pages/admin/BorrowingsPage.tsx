import { useEffect, useState } from "react";

import {BorrowingAPI } from "../../api/borrowing.api";

import type { Borrowing } from "../../types/borrowing";

export default function BorrowingsPage() {
  const [borrowings, setBorrowings] = useState<
    Borrowing[]
  >([]);

  useEffect(() => {
    void BorrowingAPI.getAll().then(setBorrowings);
  }, []);

  return (
    <section>
      <h1 className="mb-6 text-3xl font-bold">
        All Borrowings
      </h1>

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
                    {user?.name ??
                      `User ${borrowing.userId}`}
                  </td>

                  <td className="p-4">
                    {book?.title ??
                      `Book ${borrowing.bookId}`}
                  </td>

                  <td className="p-4">
                    {borrowing.dueDate
                      ? new Date(
                          borrowing.dueDate
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