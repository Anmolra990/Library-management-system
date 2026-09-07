import express from "express";
import BorrowingController from "../controllers/borrowing.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, BorrowingController.borrowBook);

router.get("/", authMiddleware, BorrowingController.getAllBorrowings);

router.get(
    "/user/:userId",
    authMiddleware,
    BorrowingController.getUserBorrowings
);

router.get(
    "/my-history",
    authMiddleware,
    BorrowingController.getMyBorrowings
);

router.put(
    "/:id/return",
    authMiddleware,
    BorrowingController.returnBook
);

export default router; 