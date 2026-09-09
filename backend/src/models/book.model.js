import db from "../database/connection.js";

class BookModel {

    async createBook(title, author, category, isbn, quantity, imageUrl) {

        const [result] = await db.query(
            `INSERT INTO books
            (title, author, category, isbn, quantity, available_quantity, image_url)
            VALUES (?, ?, ?, ?, ?, ?, ?)` ,
            [title, author, category, isbn, quantity, quantity, imageUrl]
        );

        return result;
    }


    async getAllBooks() {

        const [rows] = await db.query(
            "SELECT * FROM books"
        );

        return rows;
    }


    async getBookById(id) {

        const [rows] = await db.query(
            "SELECT * FROM books WHERE id = ?",
            [id]
        );

        return rows[0];
    }


    async updateBook(id, title, author, category, isbn, quantity, imageUrl) {

        const [result] = await db.query(
            `UPDATE books
             SET title = ?,
                 author = ?,
                 category = ?,
                 isbn = ?,
                 quantity = ?,
                  available_quantity = ?,
                  image_url = ?
             WHERE id = ?`,
              [title, author, category, isbn, quantity, quantity, imageUrl, id]
        );

        return result;
    }


    async deleteBook(id) {

        const [result] = await db.query(
            "DELETE FROM books WHERE id = ?",
            [id]
        );

        return result;
    }


    async searchBooks(search) {

        const [rows] = await db.query(
            `SELECT * FROM books
             WHERE title LIKE ?
             OR author LIKE ?
             OR category LIKE ?`,
            [`%${search}%`, `%${search}%`, `%${search}%`]
        );

        return rows;
    }
}

export default new BookModel();