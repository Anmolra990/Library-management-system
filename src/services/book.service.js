import BookModel from "../models/book.model.js";

class BookService {

    async createBook(data) {

        const {
            title,
            author,
            category,
            isbn,
            quantity
        } = data;

        if (!title || !author || quantity === undefined) {
            throw new Error(
                "Title, author and quantity are required"
            );
        }

        if (quantity < 0) {
            throw new Error("Quantity cannot be negative");
        }

        const result = await BookModel.createBook(
            title,
            author,
            category,
            isbn,
            quantity
        );

        return {
            id: result.insertId,
            title,
            author,
            category,
            isbn,
            quantity,
            available_quantity: quantity
        };
    }


    async getAllBooks() {
        return await BookModel.getAllBooks();
    }


    async getBookById(id) {

        const book = await BookModel.getBookById(id);

        if (!book) {
            throw new Error("Book not found");
        }

        return book;
    }


    async updateBook(id, data) {

        const book = await BookModel.getBookById(id);

        if (!book) {
            throw new Error("Book not found");
        }

        const {
            title,
            author,
            category,
            isbn,
            quantity
        } = data;

        await BookModel.updateBook(
            id,
            title,
            author,
            category,
            isbn,
            quantity
        );

        return await BookModel.getBookById(id);
    }


    async deleteBook(id) {

        const book = await BookModel.getBookById(id);

        if (!book) {
            throw new Error("Book not found");
        }

        await BookModel.deleteBook(id);

        return {
            message: "Book deleted successfully"
        };
    }


    async searchBooks(search) {

        if (!search) {
            throw new Error("Search term is required");
        }

        return await BookModel.searchBooks(search);
    }
}

export default new BookService();