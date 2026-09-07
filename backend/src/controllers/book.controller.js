import BookService from "../services/book.service.js";

class BookController {

    async createBook(req, res) {

        try {

            const book = await BookService.createBook(req.body);

            res.status(201).json({
                message: "Book created successfully",
                book
            });

        } catch (error) {

            res.status(400).json({
                message: error.message
            });

        }
    }


    async getAllBooks(req, res) {

        try {

            const books = await BookService.getAllBooks();

            res.status(200).json({
                count: books.length,
                books
            });

        } catch (error) {

            res.status(500).json({
                message: error.message
            });

        }
    }


    async getBookById(req, res) {

        try {

            const book = await BookService.getBookById(
                req.params.id
            );

            res.status(200).json({
                book
            });

        } catch (error) {

            res.status(404).json({
                message: error.message
            });

        }
    }


    async updateBook(req, res) {

        try {

            const book = await BookService.updateBook(
                req.params.id,
                req.body
            );

            res.status(200).json({
                message: "Book updated successfully",
                book
            });

        } catch (error) {

            res.status(400).json({
                message: error.message
            });

        }
    }


    async deleteBook(req, res) {

        try {

            const result = await BookService.deleteBook(
                req.params.id
            );

            res.status(200).json(result);

        } catch (error) {

            res.status(404).json({
                message: error.message
            });

        }
    }


    async searchBooks(req, res) {

        try {

            const books = await BookService.searchBooks(
                req.query.search
            );

            res.status(200).json({
                count: books.length,
                books
            });

        } catch (error) {

            res.status(400).json({
                message: error.message
            });

        }
    }
}

export default new BookController();