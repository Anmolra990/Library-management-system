import express from "express";
import BookController from "../controllers/book.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";
import multer from "multer";
import path from "node:path";
import crypto from "node:crypto";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const router = express.Router();
const uploadDirectory = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../../uploads"
);
fs.mkdirSync(uploadDirectory, { recursive: true });
const upload = multer({
    storage: multer.diskStorage({
        destination: uploadDirectory,
        filename: (req, file, callback) => {
            const extension = path.extname(file.originalname).toLowerCase();
            callback(null, `${crypto.randomUUID()}${extension}`);
        }
    }),
    fileFilter: (req, file, callback) => {
        callback(null, file.mimetype.startsWith("image/"));
    },
    limits: { fileSize: 5 * 1024 * 1024 }
});


router.get("/", BookController.getAllBooks);
router.get("/search", BookController.searchBooks);
router.get("/:id", BookController.getBookById);


router.post(
    "/",
    authMiddleware,
    adminMiddleware,
    upload.single("image"),
    BookController.createBook
);

router.put(
    "/:id",
    authMiddleware,
    adminMiddleware,
    upload.single("image"),
    BookController.updateBook
);

router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    BookController.deleteBook
);

export default router;