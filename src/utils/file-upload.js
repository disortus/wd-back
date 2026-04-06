import fs from "fs";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const IMGS_DIR = path.resolve(__dirname, "../../imgs");

if (!fs.existsSync(IMGS_DIR)) {
    fs.mkdirSync(IMGS_DIR, { recursive: true });
}

const sanitizeName = (value = "file") => value
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "file";

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, IMGS_DIR);
    },
    filename: (_req, file, cb) => {
        const extension = path.extname(file.originalname || "") || ".jpg";
        const basename = sanitizeName(path.basename(file.originalname || "file", extension));
        cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}-${basename}${extension}`);
    }
});

const imageFileFilter = (_req, file, cb) => {
    if (file.mimetype?.startsWith("image/")) {
        return cb(null, true);
    }

    cb(new Error("Only image files are allowed"));
};

export const upload = multer({
    storage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024,
        files: 10
    }
});

export const toStoredFilePath = (file) => file ? `/imgs/${file.filename}` : "";

export const toStoredFilePaths = (files = []) => files.map(toStoredFilePath).filter(Boolean);