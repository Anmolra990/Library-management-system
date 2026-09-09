import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

console.log("MySQL connected!");

const [imageColumn] = await db.query(
    `SELECT 1
     FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = 'books'
       AND COLUMN_NAME = 'image_url'
     LIMIT 1`
);

if (imageColumn.length === 0) {
    await db.query(
        "ALTER TABLE books ADD COLUMN image_url VARCHAR(2048) NULL"
    );
    console.log("Added books.image_url column.");
}

export default db;