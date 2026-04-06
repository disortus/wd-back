import dotenv from "dotenv";

dotenv.config();

// URIs
export const PORT = process.env.PORT || 5000;
export const MONGO_URI = process.env.MONGO_URI;

// JWTs
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRE = process.env.JWT_EXPIRE;

// Original admin
export const ORIGINAL_ADMIN_FULLNAME = process.env.ORIGINAL_ADMIN_FULLNAME;
export const ORIGINAL_ADMIN_PHONE = process.env.ORIGINAL_ADMIN_PHONE;
export const ORIGINAL_ADMIN_PASSWORD = process.env.ORIGINAL_ADMIN_PASSWORD;

// Default staff - Moderator
export const ORIGINAL_MODERATOR_FULLNAME = process.env.ORIGINAL_MODERATOR_FULLNAME;
export const ORIGINAL_MODERATOR_PHONE = process.env.ORIGINAL_MODERATOR_PHONE;
export const ORIGINAL_MODERATOR_PASSWORD = process.env.ORIGINAL_MODERATOR_PASSWORD;

// Default staff - Courier
export const ORIGINAL_COURIER_FULLNAME = process.env.ORIGINAL_COURIER_FULLNAME;
export const ORIGINAL_COURIER_PHONE = process.env.ORIGINAL_COURIER_PHONE;
export const ORIGINAL_COURIER_PASSWORD = process.env.ORIGINAL_COURIER_PASSWORD;

// Default staff - Support
export const ORIGINAL_SUPPORT_FULLNAME = process.env.ORIGINAL_SUPPORT_FULLNAME;
export const ORIGINAL_SUPPORT_PHONE = process.env.ORIGINAL_SUPPORT_PHONE;
export const ORIGINAL_SUPPORT_PASSWORD = process.env.ORIGINAL_SUPPORT_PASSWORD;

// Default staff - Developer
export const ORIGINAL_DEVELOPER_FULLNAME = process.env.ORIGINAL_DEVELOPER_FULLNAME;
export const ORIGINAL_DEVELOPER_PHONE = process.env.ORIGINAL_DEVELOPER_PHONE;
export const ORIGINAL_DEVELOPER_PASSWORD = process.env.ORIGINAL_DEVELOPER_PASSWORD;

// TODO: integrate envalide and validate env varialbles
