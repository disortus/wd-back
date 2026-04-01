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
export const ORIGINAL_ADMIN_EMAIL = process.env.ORIGINAL_ADMIN_EMAIL;
export const ORIGINAL_ADMIN_PASSWORD = process.env.ORIGINAL_ADMIN_PASSWORD;

// TODO: integrate envalide and validate env varialbles