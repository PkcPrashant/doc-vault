import bcrypt from 'bcrypt';
import { signToken } from "../utils/jwt.js";
import User from "../models/User.js";

export const loginController = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ "message": "Missing required parameters" })
    }

    const user = await User.findOne({ username: username?.toLowerCase().trim() });

    if (!user) {
        return res.status(400).json({ "message": "Invalid credentials" })
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
        return res.status(400).json({ "message": "Invalid credentials" })
    }

    const token = signToken({
        userId: user._id.toString(),
        role: user.role
    });

    return res.status(200).json({ message: "Login successful!", token })
}