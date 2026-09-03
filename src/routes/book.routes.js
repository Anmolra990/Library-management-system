import express from "express";
import BookController from "../controllers/book.controller.js";

const router = express.Router();

router.post("/", BookController.createBook);

router.get("/", BookController.getAllBooks);

router.get("/search", BookController.searchBooks);

router.get("/:id", BookController.getBookById);

router.put("/:id", BookController.updateBook);

router.delete("/:id", BookController.deleteBook);

export default router;