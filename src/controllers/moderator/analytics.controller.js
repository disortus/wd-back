import Order from "../../models/Order.js";
import { ORDER_STATUS_TYPES } from "../../utils/enums.js";
import { asyncHandler } from "../../utils/async-handler.js";

// Get sales analytics with date range for moderator
export const getSalesAnalytics = asyncHandler(async (req, res) => {
    const { startDate, endDate, period = "7d" } = req.query;
    
    // Parse period if provided
    let start = new Date();
    let end = new Date();
    
    if (startDate) {
        start = new Date(startDate);
    } else {
        // Default periods
        switch (period) {
            case "1d":
                start.setDate(start.getDate() - 1);
                break;
            case "7d":
                start.setDate(start.getDate() - 7);
                break;
            case "30d":
                start.setDate(start.getDate() - 30);
                break;
            case "90d":
                start.setDate(start.getDate() - 90);
                break;
            default:
                start.setDate(start.getDate() - 7);
        }
    }
    
    if (endDate) {
        end = new Date(endDate);
    }
    
    // Get orders within date range
    const ordersQuery = {
        createdAt: {
            $gte: start,
            $lte: end
        }
    };
    
    // Total orders
    const totalOrders = await Order.countDocuments(ordersQuery);
    
    // Completed orders (delivered)
    const completedOrders = await Order.countDocuments({
        ...ordersQuery,
        status: ORDER_STATUS_TYPES.DELIVERED
    });
    
    // Canceled orders
    const canceledOrders = await Order.countDocuments({
        ...ordersQuery,
        status: ORDER_STATUS_TYPES.CANCELED
    });
    
    // Total revenue (from completed orders only)
    const revenueResult = await Order.aggregate([
        { $match: { 
            ...ordersQuery,
            status: { $ne: ORDER_STATUS_TYPES.CANCELED }
        }},
        { $group: { 
            _id: null, 
            total: { $sum: "$totalPrice" },
            count: { $sum: 1 }
        }}
    ]);
    
    const totalRevenue = revenueResult[0]?.total || 0;
    const revenueOrderCount = revenueResult[0]?.count || 0;
    
    // Average order value
    const avgOrderValue = revenueOrderCount > 0 ? totalRevenue / revenueOrderCount : 0;
    
    // Daily breakdown
    const dailyStats = await Order.aggregate([
        { $match: ordersQuery },
        {
            $group: {
                _id: { 
                    $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                },
                orders: { $sum: 1 },
                revenue: { $sum: "$totalPrice" },
                canceled: {
                    $sum: { $cond: [{ $eq: ["$status", ORDER_STATUS_TYPES.CANCELED] }, 1, 0] }
                }
            }
        },
        { $sort: { _id: 1 } }
    ]);
    
    // Top selling products
    const topProducts = await Order.aggregate([
        { $match: { ...ordersQuery, status: { $ne: ORDER_STATUS_TYPES.CANCELED } } },
        { $unwind: "$items" },
        {
            $group: {
                _id: "$items.product",
                title: { $first: "$items.productSnapshot.title" },
                totalQuantity: { $sum: "$items.quantity" },
                totalRevenue: { $sum: "$items.subtotal" }
            }
        },
        { $sort: { totalRevenue: -1 } },
        { $limit: 10 }
    ]);
    
    // Orders by status
    const ordersByStatus = await Order.aggregate([
        { $match: ordersQuery },
        { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    
    res.json({
        ok: true,
        data: {
            period: {
                start: start.toISOString(),
                end: end.toISOString(),
                label: period || `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`
            },
            summary: {
                totalOrders,
                completedOrders,
                canceledOrders,
                totalRevenue,
                avgOrderValue: Math.round(avgOrderValue),
                completionRate: totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0
            },
            dailyStats,
            topProducts,
            ordersByStatus: Object.fromEntries(ordersByStatus.map(s => [s._id, s.count]))
        }
    });
});
