import api from "./axios";
import type { Borrowing } from "../types/borrowing";

function extractBorrowings(data: unknown): Borrowing[] {
  if (Array.isArray(data)) return data as Borrowing[];

  if (!data || typeof data !== "object") return [];

  const body = data as {
    borrowings?: unknown;
    data?: unknown;
  };

  if (Array.isArray(body.borrowings)) {
    return body.borrowings as Borrowing[];
  }

  if (Array.isArray(body.data)) {
    return body.data as Borrowing[];
  }

  if (body.data && typeof body.data === "object") {
    const nested = body.data as { borrowings?: unknown };

    if (Array.isArray(nested.borrowings)) {
      return nested.borrowings as Borrowing[];
    }
  }

  return [];
}

export const borrowingApi = {
  async borrow(bookId: number): Promise<void> {
    await api.post("/borrowings", { bookId });
  },

  async getMine(): Promise<Borrowing[]> {
    const response = await api.get("/borrowings/my-history");
    return extractBorrowings(response.data);
  },

  async getAll(): Promise<Borrowing[]> {
    const response = await api.get("/borrowings");
    return extractBorrowings(response.data);
  },

  async getForUser(userId: number): Promise<Borrowing[]> {
    const response = await api.get(`/borrowings/user/${userId}`);
    return extractBorrowings(response.data);
  },

  async returnBook(id: number): Promise<void> {
    await api.put(`/borrowings/${id}/return`);
  },
};

// Compatibility names used by your pages
export const BorrowingAPI = borrowingApi;
export const BorrowBook = borrowingApi;