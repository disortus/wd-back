import Product from "../../models/Product.js";
import { AppError } from "../../utils/app-errors.js";
import { asyncHandler } from "../../utils/async-handler.js";

// Increase product stock (moderator can only add, not remove)
export const increaseStock = asyncHandler(
  async (req, res) => {
    const { quantity } = req.body;
    const productId = req.params.id;

    if (!quantity || quantity <= 0) {
      throw new AppError(400, "quantity must be a positive number");
    }

    const product = await Product.findById(productId);

    if (!product) {
      throw new AppError(404, "product not found");
    }

    product.stock += quantity;

    await product.save();

    res.json({
      success: true,
      data: product
    });
  }
);

// Get all products (moderator can view stock levels)
export const getProductsModerator = asyncHandler(
  async (req, res) => {
    const { page = 1, limit = 20 } = req.query;

    const products = await Product.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Product.countDocuments();

    res.json({
      success: true,
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  }
);