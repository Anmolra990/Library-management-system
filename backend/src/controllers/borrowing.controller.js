import BorrowingService from "../services/borrowing.service.js";

class BorrowingController {
  async borrowBook(req, res) {
    try {
      const { bookId } = req.body;

      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          message: "User is not authenticated",
        });
      }

      if (!bookId) {
        return res.status(400).json({
          message: "Book ID is required",
        });
      }

      const borrowing =
        await BorrowingService.borrowBook(
          userId,
          bookId
        );

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
    console.log("Logged-in user:", req.user);

    const userId = req.user.id;
    const borrowings = await BorrowingService.getUserBorrowings(userId);

    console.log("User ID:", userId);
    console.log("Borrowings:", borrowings);

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

      const borrowings =
        await BorrowingService.getUserBorrowings(
          userId
        );

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
      const borrowing =
        await BorrowingService.returnBook(
          req.params.id
        );

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
      const borrowings =
        await BorrowingService.getAllBorrowings();

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