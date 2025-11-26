import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Local Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// Upload single file (for avatar)
router.post("/", upload.single("image"), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        // Return local path (served via static middleware in app.ts)
        const imageUrl = `${process.env.BACKEND_URL || "http://localhost:5000"}/uploads/${req.file.filename}`;
        res.json({ imageUrl });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ message: "Image upload failed" });
    }
});

// Upload multiple files (for products)
router.post("/multiple", upload.array("images", 5), (req, res) => {
    try {
        if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
            return res.status(400).json({ message: "No files uploaded" });
        }

        // Map files to their local URLs
        const imageUrls = (req.files as Express.Multer.File[]).map((file) => {
            return `${process.env.BACKEND_URL || "http://localhost:5000"}/uploads/${file.filename}`;
        });

        res.json({ imageUrls });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ message: "Image upload failed" });
    }
});

export default router;
