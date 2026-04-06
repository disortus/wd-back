import bcrypt from "bcrypt";
import User from "../../models/User.js";
import { USER_ROLE_TYPES, USER_ROLE_TYPES_LIST, STAFF_ROLE_TYPES_LIST } from "../../utils/enums.js";
import { AppError } from "../../utils/app-errors.js";
import { asyncHandler } from "../../utils/async-handler.js";

// Get all users
export const getUsers = asyncHandler(async (req, res) => {

    const {
        page = "1",
        limit = "20",
        role,
        search
    } = req.query;


    const pageNumber =
        Number(page) || 1;

    const limitNumber =
        Number(limit) || 20;


    const query = {};


    if (role) {

        query.role = role;

    }


    if (search) {

        query.$or = [

            {
                fullname: {
                    $regex: search,
                    $options: "i"
                }
            },

            {
                phone: {
                    $regex: search,
                    $options: "i"
                }
            }

        ];

    }


    const users =
        await User
            .find(query)

            .select("-passwordHash")

            .sort({
                createdAt: -1
            })

            .skip(
                (pageNumber - 1) *
                limitNumber
            )

            .limit(
                limitNumber
            )

            .lean();


    const total =
        await User
            .countDocuments(query);


    res.json({

        ok: true,

        data: users,

        pagination: {

            page: pageNumber,

            limit: limitNumber,

            total,

            pages:
                Math.ceil(
                    total /
                    limitNumber
                )
        }
    });
});

// Get single user
export const getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-passwordHash");

    if (!user) {
        throw new AppError(404, "User not found");
    }

    res.json({
        ok: true,
        data: user
    });
});

// Create new staff user
export const createUser = asyncHandler(async (req, res) => {
    const { fullname, phone, password, role } = req.body;

    if (!fullname || !phone || !password || !role) {
        throw new AppError(400, "Fullname, phone, password and role are required");
    }

    if (!USER_ROLE_TYPES_LIST.includes(role)) {
        throw new AppError(400, "Invalid role");
    }

    // Prevent creating admin role unless current user is admin
    if (role === USER_ROLE_TYPES.ADMIN && req.auth.role !== USER_ROLE_TYPES.ADMIN) {
        throw new AppError(403, "Only admins can create admin users");
    }

    const exists = await User.findOne({ phone });
    if (exists) {
        throw new AppError(400, "Phone already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
        fullname,
        phone,
        passwordHash,
        role,
        staffInfo: {
            hireDate: new Date()
        }
    });

    res.status(201).json({
        ok: true,
        data: {
            id: user._id,
            fullname: user.fullname,
            phone: user.phone,
            role: user.role,
            createdAt: user.createdAt
        }
    });
});

// Update user
export const updateUser = asyncHandler(async (req, res) => {
    const { fullname, phone, role, isActive, staffInfo } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
        throw new AppError(404, "User not found");
    }

    // Prevent role change to admin unless current user is admin
    if (role === USER_ROLE_TYPES.ADMIN && req.auth.role !== USER_ROLE_TYPES.ADMIN) {
        throw new AppError(403, "Only admins can assign admin role");
    }

    // Prevent demoting self
    if (user._id.toString() === req.auth.id && role && role !== user.role) {
        throw new AppError(400, "Cannot change your own role");
    }

    if (fullname) {
        user.fullname = fullname;
    }

    if (phone !== undefined) {
        user.phone = phone;
    }

    if (role) {
        user.role = role;
    }

    if (isActive !== undefined) {
        user.isActive = isActive;
    }

    if (staffInfo) {
        user.staffInfo = { ...user.staffInfo, ...staffInfo };
    }

    await user.save();

    res.json({
        ok: true,
        data: user
    });
});

// // Update user password
// export const updateUserPassword = asyncHandler(async (req, res) => {
//     const { password } = req.body;

//     if (!password) {
//         throw new AppError(400, "Password is required");
//     }

//     const user = await User.findById(req.params.id);

//     if (!user) {
//         throw new AppError(404, "User not found");
//     }

//     const salt = await bcrypt.genSalt(10);
//     user.passwordHash = await bcrypt.hash(password, salt);

//     await user.save();

//     res.json({
//         ok: true,
//         message: "Password updated successfully"
//     });
// });

// Toggle user active status
export const toggleUserActive = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        throw new AppError(404, "User not found");
    }

    // Prevent deactivating self
    if (user._id.toString() === req.auth.id) {
        throw new AppError(400, "Cannot deactivate your own account");
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
        ok: true,
        data: {
            id: user._id,
            fullname: user.fullname,
            phone: user.phone,
            role: user.role,
            isActive: user.isActive
        }
    });
});

// Delete user (soft delete - just deactivate)
export const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        throw new AppError(404, "User not found");
    }

    // Prevent deleting self
    if (user._id.toString() === req.auth.id) {
        throw new AppError(400, "Cannot delete your own account");
    }

    // Soft delete by deactivating
    user.isActive = false;
    await user.save();

    res.json({
        ok: true,
        message: "User deactivated successfully"
    });
});

// Get all staff (non-client users)
export const getStaff = asyncHandler(async (req, res) => {
    const {
        page = "1",
        limit = "20",
        role,
        search,
        isActive
    } = req.query;

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 20;

    // Staff roles only (exclude regular users)
    const staffRoles = STAFF_ROLE_TYPES_LIST;
    
    const query = {
        role: { $in: staffRoles }
    };

    if (role) {
        query.role = role;
    }

    if (isActive !== undefined) {
        query.isActive = isActive === "true";
    }

    if (search) {
        query.$or = [
            { fullname: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } }
        ];
    }

    const users = await User.find(query)
        .select("-passwordHash")
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber)
        .lean();

    const total = await User.countDocuments(query);

    res.json({
        ok: true,
        data: users,
        pagination: {
            page: pageNumber,
            limit: limitNumber,
            total,
            pages: Math.ceil(total / limitNumber)
        }
    });
});

// Delete staff (permanent or soft)
export const deleteStaff = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { permanent = false } = req.query;

    const user = await User.findById(id);

    if (!user) {
        throw new AppError(404, "Staff not found");
    }

    // Prevent deleting self
    if (user._id.toString() === req.auth.id) {
        throw new AppError(400, "Cannot delete your own account");
    }

    if (permanent) {
        await User.findByIdAndDelete(id);
        res.json({
            ok: true,
            message: "Staff permanently deleted"
        });
    } else {
        user.isActive = false;
        await user.save();
        res.json({
            ok: true,
            message: "Staff deactivated successfully"
        });
    }
});

// Get users by role
export const getUsersByRole = asyncHandler(async (req, res) => {
    const { role } = req.params;

    if (!USER_ROLE_TYPES_LIST.includes(role)) {
        throw new AppError(400, "Invalid role");
    }

    const users = await User.find({ role, isActive: true })
        .select("_id fullname phone");

    res.json({
        ok: true,
        data: users
    });
});

// Get user statistics
export const getUserStats = asyncHandler(async (req, res) => {
    const totalUsers = await User.countDocuments();

    const activeUsers = await User.countDocuments({ isActive: true });

    const usersByRole = await User.aggregate([
        { $group: { _id: "$role", count: { $sum: 1 } } }
    ]);

    const recentUsers = await User.find()
        .select("-passwordHash")
        .limit(5);

    res.json({
        ok: true,
        data: {
            totalUsers,
            activeUsers,
            usersByRole: Object.fromEntries(usersByRole.map(r => [r._id, r.count])),
            recentUsers
        }
    });
});