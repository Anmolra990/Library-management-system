import type { Book } from "./books";
import type { User } from "./auth";

export interface Borrowing {
  id: number;
  userId?: number;
  bookId?: number;
  borrowedAt?: string;
  borrowDate?: string;
  dueDate?: string;
  returnedAt?: string | null;
  returnDate?: string | null;
  status: string;
  fine?: number;
  Book?: Book;
  book?: Book;
  User?: User;
  user?: User;
  title?: string;
author?: string;
category?: string;
isbn?: string;
ISBN?: string;
book_id?: number;
borrowed_date?: string;
returned_date?: string | null;
  user_name?: string;
  email?: string;
}