import Log from "../models/Log.js";
import { asyncHandler } from "../utils/async-handler.js";

// Logging middleware
export const requestLogger = asyncHandler(async (req, res, next) => {
    const startTime = Date.now();
    
    // Capture original end function
    const originalEnd = res.end;
    
    res.end = function(chunk, encoding) {
        const responseTime = Date.now() - startTime;
        
        // Determine log level based on status code
        let level = "info";
        if (res.statusCode >= 500) {
            level = "error";
        } else if (res.statusCode >= 400) {
            level = "warn";
        }
        
        // Determine action from path and method
        const action = `${req.method} ${req.path}`;
        
        // Get user info if authenticated
        const userId = req.auth?.id || null;
        const userRole = req.auth?.role || null;
        
        // Get IP address
        const ip = req.headers['x-forwarded-for']?.split(',')[0] || 
                   req.socket?.remoteAddress || 
                   req.ip || '';
        
        // Get user agent
        const userAgent = req.headers['user-agent'] || '';
        
        // Determine status code
        const statusCode = res.statusCode;
        
        // Determine request body (sanitize sensitive data)
        let requestBody = null;
        if (req.body && typeof req.body === 'object') {
            const sanitizedBody = { ...req.body };
            const sensitiveFields = ['password', 'passwordHash', 'token', 'secret', 'authorization'];
            sensitiveFields.forEach(field => {
                if (sanitizedBody[field]) {
                    sanitizedBody[field] = '[REDACTED]';
                }
            });
            requestBody = sanitizedBody;
        }
        
        // Log asynchronously to not block the response
        Log.create({
            timestamp: new Date(),
            level,
            action,
            method: req.method,
            path: req.path,
            statusCode,
            userId,
            userRole,
            ip,
            userAgent,
            requestBody,
            responseTime,
            metadata: {
                query: req.query,
                params: req.params
            }
        }).catch(err => {
            console.error('Failed to write log:', err);
        });
        
        // Call original end
        return originalEnd.call(this, chunk, encoding);
    };
    
    next();
});

// Create log entry manually
export const createLog = async ({ level, action, userId, userRole, metadata = {} }) => {
    try {
        await Log.create({
            timestamp: new Date(),
            level,
            action,
            method: 'SYSTEM',
            path: 'INTERNAL',
            userId,
            userRole,
            metadata
        });
    } catch (err) {
        console.error('Failed to create log:', err);
    }
};

// Get logs with filtering
export const getLogs = asyncHandler(async (req, res) => {
    const { 
        page = 1, 
        limit = 50, 
        level, 
        action, 
        userId,
        startDate, 
        endDate,
        method
    } = req.query;
    
    const query = {};
    
    if (level) {
        query.level = level;
    }
    
    if (action) {
        query.action = { $regex: action, $options: 'i' };
    }
    
    if (userId) {
        query.userId = userId;
    }
    
    if (method) {
        query.method = method;
    }
    
    if (startDate || endDate) {
        query.timestamp = {};
        if (startDate) {
            query.timestamp.$gte = new Date(startDate);
        }
        if (endDate) {
            query.timestamp.$lte = new Date(endDate);
        }
    }
    
    const logs = await Log.find(query)
        .populate('userId', 'fullname phone role')
        .sort({ timestamp: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .lean();
    
    const total = await Log.countDocuments(query);
    
    res.json({
        ok: true,
        data: logs,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
        }
    });
});

// Get log statistics
export const getLogStats = asyncHandler(async (req, res) => {
    const { days = 7 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    
    const stats = await Log.aggregate([
        { $match: { timestamp: { $gte: startDate } } },
        {
            $group: {
                _id: null,
                total: { $sum: 1 },
                errors: { $sum: { $cond: [{ $eq: ['$level', 'error'] }, 1, 0] } },
                warnings: { $sum: { $cond: [{ $eq: ['$level', 'warn'] }, 1, 0] } },
                avgResponseTime: { $avg: '$responseTime' }
            }
        }
    ]);
    
    const byLevel = await Log.aggregate([
        { $match: { timestamp: { $gte: startDate } } },
        { $group: { _id: '$level', count: { $sum: 1 } } }
    ]);
    
    const byAction = await Log.aggregate([
        { $match: { timestamp: { $gte: startDate } } },
        { $group: { _id: '$action', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
    ]);
    
    const recentErrors = await Log.find({ 
        level: 'error',
        timestamp: { $gte: startDate }
    })
    .sort({ timestamp: -1 })
    .limit(10)
    .populate('userId', 'fullname phone role')
    .lean();
    
    res.json({
        ok: true,
        data: {
            period: `${days} days`,
            summary: stats[0] || { total: 0, errors: 0, warnings: 0, avgResponseTime: 0 },
            byLevel: Object.fromEntries(byLevel.map(l => [l._id, l.count])),
            topActions: byAction,
            recentErrors
        }
    });
});
