import api from "./axios";
import type { Borrowing } from "../types/borrowing";

export const BorrowingAPI = async (
  bookId: number
): Promise<void> => {
  await api.post("/borrowings", {
    bookId,
  });
};

export const getMyBorrowings = async (): Promise<
  Borrowing[]
> => {
  const response = await api.get<{ borrowings: Borrowing[] }>(
    "/borrowings/my-history"
  );

  return response.data.borrowings;
};

export const getAllBorrowings = async (): Promise<
  Borrowing[]
> => {
  const response = await api.get<{ borrowings: Borrowing[] }>(
    "/borrowings"
  );

  return response.data.borrowings;
};

export const returnBook = async (
  borrowingId: number
): Promise<void> => {
  await api.put(`/borrowings/${borrowingId}/return`);
};


