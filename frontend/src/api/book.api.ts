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
    convertBookData(data)
  );

  return response.data.book;
};

export const updateBook = async (
  id: number,
  data: Partial<BookInput>
): Promise<Book> => {
  const response = await api.put<{ book: Book }>(
    `/books/${id}`,
    convertBookData(data)
  );

  return response.data.book;
};

const convertBookData = (data: Partial<BookInput>) => ({
  title: data.title,
  author: data.author,
  ISBN: data.isbn,
  category: data.category,
  description: data.description ?? null,

  // MySQL column names
  quantity: Number(data.totalCopies),
  available_quantity: Number(data.availableCopies),
});

export const deleteBook = async (
  id: number
): Promise<void> => {
  await api.delete(`/books/${id}`);
};
export const bookApi = {
  getAll: getAllBooks,
  getById: getBookById,
  create: createBook,
  update: updateBook,
  remove: deleteBook,
  convertData: convertBookData,
};
