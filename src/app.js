import express from "express";
import db from "./database/connection.js";
import userRoutes from "./routes/user.routes.js";
import bookRoutes from "./routes/book.routes.js";
import borrowingRoutes from "./routes/borrowing.routes.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Library Management System API"
    });
});

app.get("/test-db", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT 1 AS result");

        res.json({
            message: "MySQL is connected",
            data: rows
        });
    } catch (error) {
        res.status(500).json({
            message: "MySQL connection failed",
            error: error.message
        });
    }
});
app.use("/api/users", userRoutes);

app.use("/api/books", bookRoutes);

app.use("/api/borrowings", borrowingRoutes);

export default app;