import slugify from "slugify";
import Category from "../models/Category.js";
import { AppError } from "../utils/app-errors.js";
import { asyncHandler } from "../utils/async-handler.js";

export const cretaeCategory = asyncHandler(async (req, res) => {
    try {
        const { name, image } = req.body;

        const slug = slugify(req.body.name, { lower: true, strict: true });

        const exists = await Category.findOne({ name });

        if (exists) {
            throw new AppError(400, "category already exists");
        }

        const category = Category.create({
            name,
            slug,
            image
        });

        res.status(201).json({
            ok: true,
            message: "category updated",
            category
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            error,
            message: "cretate category error"
        });
    }
});

export const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find().sort({ cretaedAt: -1 });
    
    if (!categories) {
        throw new AppError(404, "categories not found");
    }

    res.json(categories);
});

export const getCategoryById = asyncHandler(async (req, res) => {
    const catagory = await Category.findById(req.params.id);

    if (!catagory) {
        throw new AppError(404, "category not found");
    }

    res.json(catagory);
});

export const updateCategory = asyncHandler(async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body,
            { new: true, runValidators: true });
        
        if (!category) {
            throw new AppError(404, "category not found");
        }
    } catch (error) {
        return res.status(500).json({
            error,
            message: "category update error"
        });
    }
});

export const deleteCategory = asyncHandler(async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);

        if (!category) {
            throw new AppError(404, "category not found");
        }

        res.json({
            ok: true,
            message: "category deleted"
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            error,
            message: "category delete error"
        });
    }
});