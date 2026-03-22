import bcrypt from 'bcrypt';
import { signToken } from "../utils/jwt.js";
import User from "../models/User.js";
import { ApiError } from '../utils/ApiError.js';
import { successResponse } from '../utils/successResponse.js';

export const loginController = async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
        throw new ApiError(400, "Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
        throw new ApiError(400, "Invalid credentials");
    }

    const token = signToken({
        userId: user._id.toString(),
        role: user.role
    });

    return successResponse(res, 200, "Login successful!", { token });
}