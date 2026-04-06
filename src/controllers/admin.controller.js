import bcrypt, { genSalt } from "bcrypt";
import User from "../models/User.js";
import { AppError } from "../utils/app-errors.js";
import { asyncHandler } from "../utils/async-handler.js";

export const createUser = asyncHandler(async (req, res) => {
    const { fullname, phone, password, role } = req.body;

    const exists = await User.findOne({ phone });

    if (exists) {
        throw new AppError(400, "phone already in use");
    }

    const salt = await genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
        fullname,
        phone,
        passwordHash,
        role
    });

    res.status(201).json({
        ok: true,
        data: {
            id: user._id,
            fullname: user.fullname,
            phone: user.phone,
            role: user.role
        }
    });
});

export const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find()
        .select("-passwordHash")
        .sort({ createdAt: -1 })
        .exec();

    res.json({
        ok: true,
        data: users
    });
});

export const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, 
        { returnDocument: "after", runValidators: true }).select("-passwordHash");

    if (!user) {
        throw new AppError(404, "user not found");
    }

    res.json({
        ok: true,
        data: user
    });
});

export const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
        throw new AppError(404, "user not found");
    }

    res.json({
        ok: true,
        message: "user deleted"
    });
});