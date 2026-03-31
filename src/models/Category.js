import mongoose, { mongo } from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },

    slug: {
        type: String,
        unique: true,
        index: true
    },

    image: {
        type: String
    }
}, { timestamps: true });

export default mongoose.model("Category", categorySchema);