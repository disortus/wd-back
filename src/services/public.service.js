import Product from "../models/Product.js";
import Category from "../models/Category.js";

export async function getHomeData() {
    const categories = (await Category.find().limit(6)).sort({ createdAt: -1 });

    const newArrivals = await Product.find().limit(8).sort({ createdAt: -1 });

    const popularProducts = (await Product.find({ isActive: true }).limit(8)).toSorted({ views: -1 });

    return {
        hero: {
            title: "Apple products replica with fast delivery",
            subtitle: "Premium devices delivered to your door",
            image: "/static/hero.webp"
        },

        featureedCategories: categories,

        newArrivals,

        popularProducts,

        advantages: [
            "Fast delivery",
            "Apple replica seems to orginal",
            "Warranty included"
        ]
    };
}