import bcrypt from "bcrypt";
import User from "../models/User.js";
import { generateAccessToken } from "../utils/jwt.js";
import { USER_ROLE_TYPES } from "../utils/enums.js";
import { AppError } from "../utils/app-errors.js";
import { asyncHandler } from "../utils/async-handler.js";

export const register = asyncHandler(async (req, res) => {
    const { fullname, email, password, phone } = req.body;

    const exists = await User.findOne({ email });

    if (exists) {
        throw new AppError(400, "email already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
        fullname,
        email,
        passwordHash,
        phone,
        role: USER_ROLE_TYPES.USER,
    });

    const token = generateAccessToken(user);

    res.json({
        user: {
            id: user._id,
            fullname: user.fullname,
            email: user.email,
            role: user.role,
        },

        token,
    });
});

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        throw new AppError(400, "invalid credentails");
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
        throw new AppError(400, "invalid email or password");
    }

    const token = generateAccessToken(user);

    return res.json({
        user: {
            id: user._id,
            fullname: user.fullname,
            email: user.email,
            role: user.role
        },

        token
    });
});

export const getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.auth.id).select("-passwordHash");

    res.json(user);
});