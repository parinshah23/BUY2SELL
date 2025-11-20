import { Router } from "express";
import multer from "multer";
import { storage } from "../config/cloudinary";

const router = Router();
const upload = multer({ storage });

// Upload single file (for avatar)
router.post("/", upload.single("image"), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        // Cloudinary returns the URL in req.file.path
        res.json({ imageUrl: req.file.path });
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

        // Map files to their Cloudinary URLs
        const imageUrls = (req.files as Express.Multer.File[]).map((file) => file.path);

        res.json({ imageUrls });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ message: "Image upload failed" });
    }
});

export default router;
