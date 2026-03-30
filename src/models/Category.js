import mongoose, { mongo } from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    slug: {
        type: String,
        unique: true
    },

    image: {
        type: String
    }
}, { timestamps: true });

export default mongoose.model("Category", categorySchema);