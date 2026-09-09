export interface Book {
  id: number;
  title: string;
  author: string;
  isbn?: string;
  ISBN?: string;
  category?: string;
  description?: string;
  imageUrl?: string;
  imageFile?: File;
  image_url?: string;
  totalCopies: number;
  availableCopies: number;
  status?: "ACTIVE" | "INACTIVE";
  quantity?: number;
available_quantity?: number;
}

export interface BookInput {
  title: string;
  author: string;
  isbn: string;
  category: string;
  description?: string;
  imageUrl?: string;
  totalCopies: number;
  availableCopies: number;
}