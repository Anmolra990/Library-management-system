import BorrowingService from "../services/borrowing.service.js";

class BorrowingController {
  async borrowBook(req, res) {
    try {
      const { userId, bookId } = req.body;

      if (!userId || !bookId) {
        return res.status(400).json({
          message: "userId and bookId are required",
        });
      }

      const borrowing = await BorrowingService.borrowBook(userId, bookId);

      res.status(201).json({
        message: "Book borrowed successfully",
        borrowing,
      });
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  }

  async getMyBorrowings(req, res) {
    try {
      const userId = req.user.id;

      const borrowings = await BorrowingService.getUserBorrowings(userId);

      res.status(200).json({
        count: borrowings.length,
        borrowings,
      });
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  }

  async getUserBorrowings(req, res) {
    try {
      const { userId } = req.params;

      const borrowings = await BorrowingService.getUserBorrowings(userId);

      res.status(200).json({
        count: borrowings.length,
        borrowings,
      });
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  }
  async returnBook(req, res) {
    try {
      const borrowing = await BorrowingService.returnBook(req.params.id);

      res.status(200).json({
        message: "Book returned successfully",
        borrowing,
      });
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  }
  async getAllBorrowings(req, res) {
    try {
      const borrowings = await BorrowingService.getAllBorrowings();

      res.status(200).json({
        count: borrowings.length,
        borrowings,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
}

export default new BorrowingController();
