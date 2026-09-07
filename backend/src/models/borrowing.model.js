import db from "../database/connection.js";

class BorrowingModel {

    async createBorrowing(userId, bookId) {

        const [result] = await db.query(
            `INSERT INTO borrowings
            (user_id, book_id, borrowed_date, status)
            VALUES (?, ?, CURDATE(), 'borrowed')`,
            [userId, bookId]
        );

        return result;
    }


    async getBorrowingById(id) {

        const [rows] = await db.query(
            "SELECT * FROM borrowings WHERE id = ?",
            [id]
        );

        return rows[0];
    }


    async getUserBorrowings(userId) {

        const [rows] = await db.query(
            `SELECT
                borrowings.id,
                books.title,
                books.author,
                borrowings.borrowed_date,
                borrowings.returned_date,
                borrowings.status
             FROM borrowings
             JOIN books ON borrowings.book_id = books.id
             WHERE borrowings.user_id = ?
             ORDER BY borrowings.id DESC`,
            [userId]
        );

        return rows;
    }


    async updateBookQuantity(bookId) {

        const [result] = await db.query(
            `UPDATE books
             SET available_quantity = available_quantity - 1
             WHERE id = ?
             AND available_quantity > 0`,
            [bookId]
        );

        return result;
    }
    async returnBook(borrowingId) {

    const [result] = await db.query(
        `UPDATE borrowings
         SET returned_date = CURDATE(),
             status = 'returned'
         WHERE id = ?
         AND status = 'borrowed'`,
        [borrowingId]
    );

    return result;
}

async increaseBookQuantity(bookId) {

    const [result] = await db.query(
        `UPDATE books
         SET available_quantity = available_quantity + 1
         WHERE id = ?`,
        [bookId]
    );

    return result;
}
async getAllBorrowings() {

    const [rows] = await db.query(`
        SELECT
            borrowings.id,
            users.name AS user_name,
            users.email,
            books.title,
            books.author,
            borrowings.borrowed_date,
            borrowings.returned_date,
            borrowings.status
        FROM borrowings
        JOIN users
            ON borrowings.user_id = users.id
        JOIN books
            ON borrowings.book_id = books.id
        ORDER BY borrowings.id DESC
    `);

    return rows;
}
}

export default new BorrowingModel();