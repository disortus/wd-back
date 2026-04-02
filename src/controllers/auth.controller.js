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
        throw new AppError(400, "Email already exists");
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

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const token = generateAccessToken(user);

    res.cookie("token", token, {
        httpOnly: true,
        secure: false, // true prod only https
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
        ok: true,
        data: {
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                role: user.role,
            },
            token,
        }
    });
});

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        throw new AppError(400, "Invalid credentials");
    }

    // Check if user is active
    if (!user.isActive) {
        throw new AppError(403, "Account is deactivated");
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
        throw new AppError(400, "Invalid email or password");
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const token = generateAccessToken(user);


    res.cookie("token", token, {
        httpOnly: true,
        secure: false, // true prod only https
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
        ok: true,
        data: {
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                role: user.role
            },
            token
        }
    });
});

export const getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.auth.id).select("-passwordHash");

    if (!user) {
        throw new AppError(404, "User not found");
    }

    res.json({
        ok: true,
        data: user
    });
});
