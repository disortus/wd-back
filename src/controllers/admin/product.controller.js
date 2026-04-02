import slugify from "slugify";
import Product from "../../models/Product.js";
import Category from "../../models/Category.js";
import Subcategory from "../../models/Subcategory.js";
import { ensureSubcategoryBelongsToCategory, validateProductAttributes } from "../../utils/catalog-helpers.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { AppError } from "../../utils/app-errors.js";

export const createProduct = asyncHandler(
  async (req, res) => {
    const {
      title,
      categorySlug,
      subcategorySlug,
      attributes,
      description,
      price,
      stock,
      images
    } = req.body;

    ensureSubcategoryBelongsToCategory(
      categorySlug,
      subcategorySlug
    );

    validateProductAttributes(
      subcategorySlug,
      attributes
    );

    const category = await Category.findOne({ slug: categorySlug, isActive: true });

    if (!category) {
      throw new AppError(400, "Category disabled");
    }

    const subcategory = await Subcategory.findOne({ slug: subcategorySlug, categorySlug, isActive: true });

    if (!subcategory) {
      throw new AppError(400, "Subcategory disabled");
    }


    const slug = slugify(title, { lower: true, strict: true });

    const exists = await Product.findOne({ slug });

    if (exists) {
      throw new AppError(409, "Product exists");
    }

    const product = await Product.create({
        title,
        slug,
        categorySlug,
        subcategorySlug,
        attributes,
        description,
        price,
        stock,
        images
      });

    res.status(201).json({
      ok: true,
      data: product
    });

  }
);



export const updateProduct = asyncHandler(
  async (req, res) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!product) {
      throw new AppError(404, "Product not found");
    }

    res.json({
      ok: true,
      data: product
    });
  }
);



export const deleteProduct = asyncHandler(
  async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      throw new AppError(404, "Product not found");
    }

    res.json({
      ok: true,
      message: "Product deleted"
    });
  }
);


export const getProductsAdmin = asyncHandler(
  async (req, res) => {
    const products = await Product.find().sort({ createdAt: -1 });

    res.json({
      ok: true,
      data: products
    });
  }
);