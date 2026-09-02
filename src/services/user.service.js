import UserModel from "../models/user.model.js";

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

    async getUserById(id) {

        const user = await UserModel.findUserById(id);

        if (!user) {
            throw new Error("User not found");
        }

        return user;
    }

}

export default new UserService();