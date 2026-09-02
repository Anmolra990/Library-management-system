import express from "express";
import db from "./database/connections.js";

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

export default app;