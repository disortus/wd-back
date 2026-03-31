import Category from "../models/Category.js";

export async function cretaeCategory(req, res) {
    try {
        const { name, slug, image } = req.body;

        const exists = await Category.findOne({ name });

        if (exists) {
            res.status(400).json({
                message: "category already exists"
            });
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
}

export async function getCategories(req, res) {
    const categories = await Category.find().sort({ cretaedAt: -1 });

    res.json(categories);
}

export async function getCategoryById(req, res) {
    const catagory = await Category.findById(req.params.id);

    if (!catagory) {
        return res.status(404).json({
            message: "category not found"
        });
    }

    res.json(catagory);
}

export async function updateCategory(req, res) {
    try {
        const category = await Category.findByIdAndUpdate(req.params.id, req.body,
            { new: true, runValidators: true });
        
        if (!category) {
            return res.status(404).json({
                message: "category not found"
            });
        }
    } catch (error) {
        return res.status(500).json({
            error,
            message: "category update error"
        });
    }
}

export async function deleteCategory(req, res) {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);

        if (!category) {
            return res.status(404).json({
                message: "category not found"
            });
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
}