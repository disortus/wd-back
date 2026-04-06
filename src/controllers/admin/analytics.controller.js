import Order from "../../models/Order.js";
import User from "../../models/User.js";
import Product from "../../models/Product.js";
import Category from "../../models/Category.js";
import SupportTicket from "../../models/SupportTicket.js";
import { ORDER_STATUS_TYPES, USER_ROLE_TYPES, STAFF_ROLE_TYPES_LIST } from "../../utils/enums.js";
import { asyncHandler } from "../../utils/async-handler.js";

// Get sales analytics with date range
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

// Get staff metrics (for admin dashboard)
export const getStaffMetrics = asyncHandler(async (req, res) => {
    // Get all staff users (non-clients)
    const staffUsers = await User.find({ 
        role: { $in: STAFF_ROLE_TYPES_LIST } 
    })
    .select("-passwordHash")
    .lean();
    
    const staffMetrics = [];
    
    for (const staff of staffUsers) {
        let metrics = {
            userId: staff._id,
            fullname: staff.fullname,
            phone: staff.phone,
            role: staff.role,
            isActive: staff.isActive,
            hireDate: staff.staffInfo?.hireDate,
            totalOrdersHandled: 0,
            completedOrders: 0,
            revenueGenerated: 0
        };
        
        // Count orders based on role
        let orderQuery = {};
        
        if (staff.role === USER_ROLE_TYPES.MODERATOR) {
            orderQuery = { 
                $or: [
                    { moderator: staff._id },
                    { packedBy: staff._id },
                    { assignedByModerator: staff._id }
                ]
            };
            
            // Get orders where this moderator was involved
            const moderatorOrders = await Order.find({
                $or: [
                    { moderator: staff._id },
                    { packedBy: staff._id },
                    { assignedByModerator: staff._id }
                ]
            }).lean();
            
            metrics.totalOrdersHandled = moderatorOrders.length;
            metrics.completedOrders = moderatorOrders.filter(o => o.status === ORDER_STATUS_TYPES.DELIVERED).length;
            metrics.revenueGenerated = moderatorOrders
                .filter(o => o.status !== ORDER_STATUS_TYPES.CANCELED)
                .reduce((sum, o) => sum + o.totalPrice, 0);
                
        } else if (staff.role === USER_ROLE_TYPES.COURIER) {
            const courierOrders = await Order.find({ courier: staff._id }).lean();
            
            metrics.totalOrdersHandled = courierOrders.length;
            metrics.completedOrders = courierOrders.filter(o => o.status === ORDER_STATUS_TYPES.DELIVERED).length;
            metrics.revenueGenerated = courierOrders
                .filter(o => o.status !== ORDER_STATUS_TYPES.CANCELED)
                .reduce((sum, o) => sum + o.totalPrice, 0);
                
        } else if (staff.role === USER_ROLE_TYPES.SUPPORT) {
            // Support staff handles tickets
            const ticketCount = await SupportTicket.countDocuments({ 
                assignedTo: staff._id 
            });
            const resolvedTickets = await SupportTicket.countDocuments({ 
                assignedTo: staff._id,
                status: "resolved"
            });
            
            metrics.totalTicketsHandled = ticketCount;
            metrics.resolvedTickets = resolvedTickets;
        }
        
        staffMetrics.push(metrics);
    }
    
    res.json({
        ok: true,
        data: staffMetrics
    });
});

// Get system overview (for admin dashboard)
export const getSystemOverview = asyncHandler(async (req, res) => {
    const [
        totalUsers,
        totalProducts,
        totalCategories,
        totalOrders,
        totalTickets,
        activeOrders,
        recentOrders
    ] = await Promise.all([
        User.countDocuments(),
        Product.countDocuments(),
        Category.countDocuments(),
        Order.countDocuments(),
        SupportTicket.countDocuments(),
        Order.countDocuments({ status: { $nin: [ORDER_STATUS_TYPES.DELIVERED, ORDER_STATUS_TYPES.CANCELED] } }),
        Order.find().sort({ createdAt: -1 }).limit(5).populate("userId", "fullname phone").lean()
    ]);
    
    // Revenue calculation
    const revenueData = await Order.aggregate([
        { $match: { status: { $ne: ORDER_STATUS_TYPES.CANCELED } } },
        { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);
    
    const totalRevenue = revenueData[0]?.total || 0;
    
    // Users by role
    const usersByRole = await User.aggregate([
        { $group: { _id: "$role", count: { $sum: 1 } } }
    ]);
    
    // Products out of stock
    const outOfStock = await Product.countDocuments({ stock: 0 });
    
    res.json({
        ok: true,
        data: {
            totals: {
                users: totalUsers,
                products: totalProducts,
                categories: totalCategories,
                orders: totalOrders,
                tickets: totalTickets
            },
            status: {
                activeOrders,
                outOfStock,
                totalRevenue
            },
            usersByRole: Object.fromEntries(usersByRole.map(r => [r._id, r.count])),
            recentOrders
        }
    });
});
