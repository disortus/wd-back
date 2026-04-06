import Product from "../../models/Product.js";
import { AppError } from "../../utils/app-errors.js";
import { asyncHandler } from "../../utils/async-handler.js";

export const getProducts = asyncHandler(async (req, res) => {
    const { category, subcategory, minPrice, maxPrice, page=1, limit=10, search } = req.query;

    const filter = { isActive: true };

    if (category) {
        filter.categorySlug = category;
    }

    if (subcategory) {
        filter.subcategorySlug = subcategory;
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
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 });
    
    const total = await Product.countDocuments(filter);

    res.json({
        ok: true,
        data: products,
        total,
        page,
        pages: Math.ceil(total / limit)
    });
});

export const getProductBySlug = asyncHandler(async (req, res) => {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true });

    if (!product) {
        throw new AppError(404, "product not found");
    }

    res.json({
        ok: true,
        data: product
    });
});