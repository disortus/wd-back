import mongoose from "mongoose";
import { USER_ROLE_TYPES_LIST, USER_ROLE_TYPES, DB_MODELS } from "../utils/enums.js";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    passwordHash: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        default: ""
    },

    role: {
        type: String,
        enum: USER_ROLE_TYPES_LIST,
        default: USER_ROLE_TYPES.USER
    },

    isActive: {
        type: Boolean,
        default: true
    },

    lastLogin: {
        type: Date,
        default: null
    },

    // Profile extension fields
    profile: {
        avatar: {
            type: String,
            default: ""
        },
        dateOfBirth: {
            type: Date,
            default: null
        },
        gender: {
            type: String,
            enum: ["male", "female", "other", ""],
            default: ""
        },
        bio: {
            type: String,
            default: ""
        }
    },

    // Delivery addresses (for future extension)
    addresses: [{
        label: {
            type: String,
            default: "Home"
        },
        isDefault: {
            type: Boolean,
            default: false
        },
        recipientName: {
            type: String,
            default: ""
        },
        phone: {
            type: String,
            default: ""
        },
        street: {
            type: String,
            default: ""
        },
        city: {
            type: String,
            default: ""
        },
        postalCode: {
            type: String,
            default: ""
        },
        country: {
            type: String,
            default: ""
        },
        instructions: {
            type: String,
            default: ""
        }
    }],

    // Notification preferences
    notifications: {
        email: {
            orderUpdates: { type: Boolean, default: true },
            promotions: { type: Boolean, default: false },
            supportUpdates: { type: Boolean, default: true }
        },
        sms: {
            orderUpdates: { type: Boolean, default: true },
            promotions: { type: Boolean, default: false }
        }
    },

    // Statistics (for admin/moderator use)
    stats: {
        totalOrders: {
            type: Number,
            default: 0
        },
        totalSpent: {
            type: Number,
            default: 0
        },
        activeOrders: {
            type: Number,
            default: 0
        },
        openTickets: {
            type: Number,
            default: 0
        }
    },

    // For staff roles
    staffInfo: {
        department: {
            type: String,
            default: ""
        },
        employeeId: {
            type: String,
            default: ""
        },
        hireDate: {
            type: Date,
            default: null
        },
        permissions: [{
            type: String
        }]
    }
}, { timestamps: true });

// Indexes
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ "stats.totalSpent": -1 });

// Virtual for getting default address
userSchema.virtual("defaultAddress").get(function() {
    return this.addresses.find(addr => addr.isDefault) || this.addresses[0] || null;
});

// Method to get public profile
userSchema.methods.getPublicProfile = function() {
    return {
        id: this._id,
        fullname: this.fullname,
        email: this.email,
        phone: this.phone,
        role: this.role,
        avatar: this.profile?.avatar || "",
        createdAt: this.createdAt
    };
};

// Method to get full profile
userSchema.methods.getFullProfile = function() {
    return {
        id: this._id,
        fullname: this.fullname,
        email: this.email,
        phone: this.phone,
        role: this.role,
        profile: this.profile,
        addresses: this.addresses,
        notifications: this.notifications,
        stats: this.stats,
        createdAt: this.createdAt,
        lastLogin: this.lastLogin
    };
};

// Method to update stats after order
userSchema.methods.updateOrderStats = async function(totalAmount, increment = true) {
    const update = increment ? 1 : -1;
    this.stats.totalOrders += update;
    this.stats.totalSpent += totalAmount * (increment ? 1 : -1);
    await this.save();
};

// Static to find users by role
userSchema.statics.findByRole = function(role) {
    return this.find({ role, isActive: true });
};

// Static to get available staff for specific roles
userSchema.statics.getAvailableStaff = function(roles) {
    return this.find({ 
        role: { $in: roles }, 
        isActive: true 
    }).select("_id fullname email role");
};

export default mongoose.model(DB_MODELS.USER, userSchema);
