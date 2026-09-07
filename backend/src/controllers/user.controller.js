import UserService from "../services/user.service.js";

class UserController {
  async register(req, res) {
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          message: "Name, email and password are required",
        });
      }

      const user = await UserService.registerUser(name, email, password, role);

      res.status(201).json({
        message: "User registered successfully",
        user,
      });
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  }

  async getProfile(req, res) {
    try {
      const user = await UserService.getUserById(req.user.id);

      res.status(200).json({
        user,
      });
    } catch (error) {
      res.status(404).json({
        message: error.message,
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          message: "Email and password are required",
        });
      }

      const result = await UserService.loginUser(email, password);

      res.status(200).json({
        message: "Login successful",
        ...result,
      });
    } catch (error) {
      res.status(401).json({
        message: error.message,
      });
    }
  }
}

export default new UserController();
