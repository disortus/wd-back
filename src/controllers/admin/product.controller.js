import slugify from "slugify";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import Product from "../../models/Product.js";

import Category from "../../models/Category.js";

import Subcategory from "../../models/Subcategory.js";

import { ensureSubcategoryBelongsToCategory, validateProductAttributes } from "../../utils/catalog-helper.js";

import { asyncHandler } from "../../utils/async-handler.js";

import { AppError } from "../../utils/app-errors.js";

import { toStoredFilePaths, IMGS_DIR } from "../../utils/file-upload.js";


export const createProduct = asyncHandler(
  async (req, res) => {

    const {

      title,
      categorySlug,
      subcategorySlug,
      attributes = {},
      description = "",
      price,
      stock = 0,
      images = [],
      mainImage = ""

    } = req.body;


    ensureSubcategoryBelongsToCategory(
      categorySlug,
      subcategorySlug
    );


    validateProductAttributes(
      subcategorySlug,
      attributes
    );


    const category =
      await Category.findOne({

        slug: categorySlug,
        isActive: true

      });


    if (!category) {

      throw new AppError(
        400,
        "category disabled"
      );

    }


    const subcategory =
      await Subcategory.findOne({

        slug: subcategorySlug,
        categorySlug,
        isActive: true

      });


    if (!subcategory) {

      throw new AppError(
        400,
        "subcategory disabled"
      );

    }


    const slug =
      slugify(title, {

        lower: true,
        strict: true

      });


    const exists =
      await Product.findOne({

        slug

      });


    if (exists) {

      throw new AppError(
        409,
        "product exists"
      );

    }


    // Handle images - set mainImage if provided, otherwise use first image from images array
    let productMainImage = mainImage;
    let productImages = images;
    
    // If mainImage is provided but images array is empty, add mainImage to images
    if (mainImage && (!images || images.length === 0)) {
      productImages = [mainImage];
    }
    
    // If images array has items but no mainImage, use first image as mainImage
    if (!mainImage && images && images.length > 0) {
      productMainImage = images[0];
    }

    const product =
      await Product.create({

        title,
        slug,
        categorySlug,
        subcategorySlug,
        attributes,
        description,
        price,
        stock,
        images: productImages,
        mainImage: productMainImage,
        category_id: category._id

      });


    res.status(201).json({

      success: true,

      data: product

    });

  }
);



export const updateProduct = asyncHandler(
  async (req, res) => {

    const {
      title,
      categorySlug,
      subcategorySlug,
      attributes,
      description,
      price,
      stock,
      images,
      mainImage
    } = req.body;

    // If updating category/subcategory, validate them
    if (categorySlug || subcategorySlug) {
      const currentProduct = await Product.findById(req.params.id);
      
      const catSlug = categorySlug || currentProduct.categorySlug;
      const subcatSlug = subcategorySlug || currentProduct.subcategorySlug;
      
      ensureSubcategoryBelongsToCategory(catSlug, subcatSlug);
      
      if (categorySlug) {
        const category = await Category.findOne({ slug: categorySlug, isActive: true });
        if (!category) {
          throw new AppError(400, "category disabled");
        }
      }
      
      if (subcategorySlug) {
        const subcategory = await Subcategory.findOne({ 
          slug: subcategorySlug, 
          categorySlug: catSlug,
          isActive: true 
        });
        if (!subcategory) {
          throw new AppError(400, "subcategory disabled");
        }
      }
    }

    // Validate attributes if provided
    if (attributes && subcategorySlug) {
      validateProductAttributes(subcategorySlug, attributes);
    } else if (attributes) {
      // Get current product to know subcategory
      const currentProduct = await Product.findById(req.params.id);
      if (currentProduct) {
        validateProductAttributes(currentProduct.subcategorySlug, attributes);
      }
    }

    // Handle images update
    let updateData = { ...req.body };
    
    if (images !== undefined || mainImage !== undefined) {
      const currentProduct = await Product.findById(req.params.id);
      const newImages = images !== undefined ? images : currentProduct.images;
      const newMainImage = mainImage !== undefined ? mainImage : currentProduct.mainImage;
      
      // If mainImage is provided but images array is empty, add mainImage to images
      if (mainImage && (!newImages || newImages.length === 0)) {
        updateData.images = [mainImage];
      }
      
      // If images array has items but no mainImage, use first image as mainImage
      if (mainImage === undefined && newImages && newImages.length > 0) {
        updateData.mainImage = newImages[0];
      }
    }

    // If title is being updated, regenerate slug
    if (title) {
      updateData.slug = slugify(title, {
        lower: true,
        strict: true
      });
    }

    const product =
      await Product.findByIdAndUpdate(

        req.params.id,

        updateData,

        {

          new: true,
          runValidators: true

        }

      );


    if (!product) {

      throw new AppError(
        404,
        "product not found"
      );

    }


    res.json({

      success: true,

      data: product

    });

  }
);



export const deleteProduct = asyncHandler(
  async (req, res) => {

    const product =
      await Product.findByIdAndDelete(

        req.params.id

      );


    if (!product) {

      throw new AppError(
        404,
        "product not found"
      );

    }


    res.json({

      success: true

    });

  }
);



// Increase product stock (admin can add or remove)
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

// Decrease product stock (admin can add or remove)
export const decreaseStock = asyncHandler(
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

    if (product.stock < quantity) {
      throw new AppError(400, "insufficient stock");
    }

    product.stock -= quantity;

    await product.save();

    res.json({
      success: true,
      data: product
    });
  }
);

// Upload product images
export const uploadProductImages = asyncHandler(
  async (req, res) => {
    const { id } = req.params;
    
    // Check if files were uploaded
    if (!req.files || req.files.length === 0) {
      throw new AppError(400, "No images uploaded");
    }

    // Find the product
    const product = await Product.findById(id);
    
    if (!product) {
      throw new AppError(404, "product not found");
    }

    // Get uploaded file paths
    const newImagePaths = toStoredFilePaths(req.files);
    
    // Add new images to existing ones
    const updatedImages = [...(product.images || []), ...newImagePaths];
    
    // If no mainImage, set the first new image as mainImage
    let mainImage = product.mainImage;
    if (!mainImage && newImagePaths.length > 0) {
      mainImage = newImagePaths[0];
    }

    // Update the product
    product.images = updatedImages;
    product.mainImage = mainImage;
    await product.save();

    res.json({
      success: true,
      data: product,
      message: `${req.files.length} image(s) uploaded successfully`
    });
  }
);

// Delete a product image by index
export const deleteProductImage = asyncHandler(
  async (req, res) => {
    const { id, imageIndex } = req.params;
    
    // Find the product
    const product = await Product.findById(id);
    
    if (!product) {
      throw new AppError(404, "product not found");
    }

    const index = parseInt(imageIndex, 10);
    
    if (index < 0 || index >= product.images.length) {
      throw new AppError(400, "Invalid image index");
    }

    // Get the image path to delete the file
    const imagePath = product.images[index];
    
    // Remove the image from the array
    product.images.splice(index, 1);
    
    // Update mainImage if needed
    if (product.mainImage === imagePath) {
      product.mainImage = product.images[0] || "";
    }

    await product.save();

    // Optionally delete the file from disk (only if it's a local image)
    if (imagePath && imagePath.startsWith("/imgs/")) {
      const filename = imagePath.replace("/imgs/", "");
      const fullPath = path.join(IMGS_DIR, filename);
      
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }

    res.json({
      success: true,
      data: product,
      message: "Image deleted successfully"
    });
  }
);

export const getProductsAdmin = asyncHandler(
  async (req, res) => {
    const { slug } = req.query;

    let query = {};
    
    if (slug) {
      query.slug = slug;
    }

    const products =
      await Product.find(query)
        .sort({ createdAt: -1 });


    res.json({

      success: true,

      data: products

    });

  }
);
