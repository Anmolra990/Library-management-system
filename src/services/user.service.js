import UserModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
class UserService {

    async registerUser(name, email, password, role = "user") {

        const existingUser = await UserModel.findUserByEmail(email);

        if (existingUser) {
            throw new Error("Email already registered");
        }

        const result = await UserModel.createUser(
            name,
            email,
            password,
            role
        );

        return {
            id: result.insertId,
            name,
            email,
            role
        };
    }

    async loginUser(email, password) {

    const user = await UserModel.findUserByEmailWithPassword(email);

    if (!user) {
        throw new Error("Invalid email or password");
    }

    if (user.password !== password) {
        throw new Error("Invalid email or password");
    }

    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
}

    async getUserById(id) {

        const user = await UserModel.findUserById(id);

        if (!user) {
            throw new Error("User not found");
        }

        return user;
    }

}

export default new UserService();