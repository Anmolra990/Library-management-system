import BorrowingModel from "../models/borrowing.model.js";
import UserModel from "../models/user.model.js";
import BookModel from "../models/book.model.js";

class BorrowingService {

    async borrowBook(userId, bookId) {

        // Check user
        const user = await UserModel.findUserById(userId);

        if (!user) {
            throw new Error("User not found");
        }


        // Check book
        const book = await BookModel.getBookById(bookId);

        if (!book) {
            throw new Error("Book not found");
        }


        // Check availability
        if (book.available_quantity <= 0) {
            throw new Error("Book is not available");
        }


        // Create borrowing
        const result = await BorrowingModel.createBorrowing(
            userId,
            bookId
        );


        // Decrease available quantity
        await BorrowingModel.updateBookQuantity(bookId);


        return {
            id: result.insertId,
            user_id: userId,
            book_id: bookId,
            status: "borrowed"
        };
    }


    async getUserBorrowings(userId) {

        const user = await UserModel.findUserById(userId);

        if (!user) {
            throw new Error("User not found");
        }

        return await BorrowingModel.getUserBorrowings(userId);
    }
    async returnBook(borrowingId) {

    const borrowing =
        await BorrowingModel.getBorrowingById(borrowingId);

    if (!borrowing) {
        throw new Error("Borrowing record not found");
    }

    if (borrowing.status === "returned") {
        throw new Error("Book has already been returned");
    }

    await BorrowingModel.returnBook(borrowingId);

    await BorrowingModel.increaseBookQuantity(
        borrowing.book_id
    );

    return {
        id: borrowing.id,
        book_id: borrowing.book_id,
        status: "returned"
    };
}
async getAllBorrowings() {

    return await BorrowingModel.getAllBorrowings();

}
}

export default new BorrowingService();