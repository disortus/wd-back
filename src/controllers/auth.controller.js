import bcrypt from "bcrypt";
import User from "../models/User.js";
import { generateAccessToken } from "../utils/jwt.js";
import { USER_ROLE_TYPES } from "../utils/enums.js";

export async function register(req, res) {
    try {
        const { fullname, email, password, phone } = req.body;

        const exists = await User.findOne({ email });

        if (exists) {
            return res.status(400).json({
                message: "email already registered",
            });
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
    } catch (error) {
        res.status(500).json({
            error,
            message: "registration error",
        });
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "invalid credentails"
            });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);

        if (!isMatch) {
            return res.status(400).json({
                message: "invalid credentails"
            });
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
    } catch (error) {
        res.status(500).json({
            error,
            message: "login error"
        });
    }
}

export async function getMe(req, res) {
    try {
        const user = await User.findById(req.auth.id).select("-passwordHash");

        res.json(user);
    } catch (error) {
        res.json({
            error,
            message: "getMe error"
        });
    }
}