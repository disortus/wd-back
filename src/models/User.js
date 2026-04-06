import mongoose from "mongoose";
import { USER_ROLE_TYPES_LIST, USER_ROLE_TYPES, DB_MODELS } from "../utils/enums.js";

const addressSchema = new mongoose.Schema({
    label: {
        type: String,
        default: "Home",
        trim: true
    },
    isDefault: {
        type: Boolean,
        default: false
    },
    recipientName: {
        type: String,
        default: "",
        trim: true
    },
    phone: {
        type: String,
        default: "",
        trim: true
    },
    address: {
        type: String,
        default: "",
        trim: true
    },
    entrance: {
        type: String,
        default: "",
        trim: true
    },
    apartment: {
        type: String,
        default: "",
        trim: true
    },
    city: {
        type: String,
        default: "Astana",
        trim: true
    },
    instructions: {
        type: String,
        default: "",
        trim: true
    }
}, { _id: true });

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true
    },

    passwordHash: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    email: {
        type: String,
        default: null,
        trim: true,
        lowercase: true
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

    addresses: {
        type: [addressSchema],
        default: []
    },

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

    staffInfo: {
        department: {
            type: String,
            default: "",
            trim: true
        },
        employeeId: {
            type: String,
            default: "",
            trim: true
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

userSchema.pre("save", async function() {
    if (typeof this.email === "string") {
        const normalizedEmail = this.email.trim().toLowerCase();
        this.email = normalizedEmail || null;
    }

    if (Array.isArray(this.addresses) && this.addresses.length > 0) {
        let hasDefault = false;

        this.addresses.forEach((address) => {
            address.city = "Astana";

            if (address.isDefault && !hasDefault) {
                hasDefault = true;
                return;
            }

            if (address.isDefault && hasDefault) {
                address.isDefault = false;
            }
        });

        if (!hasDefault) {
            this.addresses[0].isDefault = true;
        }
    }
});

// Method to get public profile
userSchema.methods.getPublicProfile = function() {
    return {
        id: this._id,
        fullname: this.fullname,
        email: this.email || "",
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
        email: this.email || "",
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
    }).select("_id fullname phone role");
};

export default mongoose.model(DB_MODELS.USER, userSchema);
