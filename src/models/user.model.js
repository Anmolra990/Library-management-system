import db from "../database/connection.js";

class UserModel {

    async createUser(name, email, password, role) {
        const [result] = await db.query(
            `INSERT INTO users (name, email, password, role)
             VALUES (?, ?, ?, ?)`,
            [name, email, password, role]
        );

        return result;
    }

    async findUserByEmail(email) {
        const [rows] = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        return rows[0];
    }

    async findUserByEmailWithPassword(email) {
        const [rows] = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        return rows[0];
    }

    async findUserById(id) {
        const [rows] = await db.query(
            "SELECT id, name, email, role FROM users WHERE id = ?",
            [id]
        );

        return rows[0];
    }
}

export default new UserModel();