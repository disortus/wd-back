import mongoose from "mongoose";
import { USER_ROLE_TYPES_LIST, USER_ROLE_TYPES, DB_MODELS } from "../utils/enums.js";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    passwordHash: {
        type: String,
        required: true
    },

    phone: {
        type: String
    },

    role: {
        type: String,
        enum: USER_ROLE_TYPES_LIST,
        default: USER_ROLE_TYPES.USER
    }
}, { timestamps: true });

export default mongoose.model(DB_MODELS.USER, userSchema);