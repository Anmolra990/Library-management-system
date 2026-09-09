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
    toBookFormData(data)
  );

  return response.data.book;
};

export const updateBook = async (
  id: number,
  data: Partial<BookInput>
): Promise<Book> => {
  const response = await api.put<{ book: Book }>(
    `/books/${id}`,
    toBookFormData(data)
  );

  return response.data.book;
};

const convertBookData = (data: Partial<BookInput>) => ({
  title: data.title,
  author: data.author,
  ISBN: data.isbn,
  category: data.category,
  description: data.description ?? null,
  image_url: data.imageUrl?.trim() || null,

  // MySQL column names
  quantity: Number(data.totalCopies),
  available_quantity: Number(data.availableCopies),
});

const toBookFormData = (data: Partial<BookInput>) => {
  const formData = new FormData();
  const converted = convertBookData(data);

  Object.entries(converted).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, String(value));
    }
  });

  if (data.imageFile) {
    formData.append("image", data.imageFile);
  }

  return formData;
};

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
