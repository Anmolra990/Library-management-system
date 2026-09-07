export interface Book {
  id: number;
  title: string;
  author: string;
  isbn?: string;
  ISBN?: string;
  category?: string;
  description?: string;
  totalCopies: number;
  availableCopies: number;
  status?: "ACTIVE" | "INACTIVE";
}

export interface BookInput {
  title: string;
  author: string;
  isbn: string;
  category: string;
  description?: string;
  totalCopies: number;
  availableCopies: number;
}