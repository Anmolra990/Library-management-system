import express from "express";
import BookController from "../controllers/book.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";

const router = express.Router();


router.get("/", BookController.getAllBooks);
router.get("/search", BookController.searchBooks);
router.get("/:id", BookController.getBookById);


router.post(
    "/",
    authMiddleware,
    adminMiddleware,
    BookController.createBook
);

router.put(
    "/:id",
    authMiddleware,
    adminMiddleware,
    BookController.updateBook
);

router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    BookController.deleteBook
);

export default router;