import slugify from "slugify";
import Product from "../models/Product.js";
import { AppError } from "../utils/app-errors.js";
import { asyncHandler } from "../utils/async-handler.js";

export const createProduct = asyncHandler(async (req, res) => {
    const slug = slugify(req.body.title, { lower: true, strict: true });

    const exists = await Product.findOne({ slug });

    if (exists) {
        throw new AppError(400, "product already exists");
    }

    const product = await Product.create({
        ...req.body,
        slug
    });

    res.status(201).json({
        ok: true,
        product
    });
});

export const updateProduct = asyncHandler(async (req, res) => {
    if (req.body.title) {
        req.body.slug = slugify(req.body.title, { lower: true, strict: true });
    }

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true});

    if (!product) {
        throw new AppError(404, "product not found");
    }

    res.json({
        ok: true,
        product
    });
});

export const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
        throw new AppError(404, "product not found");
    }

    res.json({
        ok: true,
        message: "product deleted"
    });
});

export const getProducts = asyncHandler(async (req, res) => {
    const { category, minPrice, maxPrice, page=1, limit=10, search} = req.query;

    const filter = { isActive: true };
    
    if (category) {
        filter.category = category;
    }

    if (minPrice || maxPrice) {
        filter.price = {};

        if (minPrice) {
            filter.price.$gte = minPrice;
        }

        if (maxPrice) {
            filter.price.$lte = maxPrice;
        }
    }

    if (search) {
        filter.title = {
            $regex: search,

            $options: "i"
        };
    }

    const skip = (page - 1) * limit;

    const products = await Product
        .find(filter)
        .populate("category_id")
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 });
    
    const total = await Product.countDocuments(filter);

    res.json({
        data: products,
        total,
        page,
        pages: Math.ceil(total / limit)
    });
});

export const getProductBySlug = asyncHandler(async (req, res) => {
    const product = await Product.findOne({ slug: req.params.slug }).populate("category_id");

    if (!product) {
        throw new AppError(404, "product not found");
    }

    res.json(product);
});