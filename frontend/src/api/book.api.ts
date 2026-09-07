import api from "./axios";
import type { Book, BookInput } from "../types/books";

export const getAllBooks = async (): Promise<Book[]> => {
  const response = await api.get<{ books: Book[] }>("/books");

  return response.data.books;
};

export const getBookById = async (
  id: number
): Promise<Book> => {
  const response = await api.get<{ book: Book }>(
    `/books/${id}`
  );

  return response.data.book;
};

export const createBook = async (
  data: BookInput
): Promise<Book> => {
  const response = await api.post<{ book: Book }>(
    "/books",
    data
  );

  return response.data.book;
};

export const updateBook = async (
  id: number,
  data: Partial<BookInput>
): Promise<Book> => {
  const response = await api.put<{ book: Book }>(
    `/books/${id}`,
    data
  );

  return response.data.book;
};

export const deleteBook = async (
  id: number
): Promise<void> => {
  await api.delete(`/books/${id}`);
};