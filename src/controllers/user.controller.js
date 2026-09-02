import UserService from "../services/user.service.js";

class UserController {

    async register(req, res) {

        try {

            const { name, email, password, role } = req.body;

            if (!name || !email || !password) {
                return res.status(400).json({
                    message: "Name, email and password are required"
                });
            }

            const user = await UserService.registerUser(
                name,
                email,
                password,
                role
            );

            res.status(201).json({
                message: "User registered successfully",
                user
            });

        } catch (error) {

            res.status(400).json({
                message: error.message
            });

        }
    }

}

export default new UserController();