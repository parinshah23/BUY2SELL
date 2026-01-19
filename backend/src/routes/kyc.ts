import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../middlewares/authMiddleware";

const router = Router();
const prisma = new PrismaClient();

// ✅ GET KYC STATUS
router.get("/status", verifyToken, async (req, res) => {
    try {
        const userId = (req as any).user.id;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { kycStatus: true, kycDocs: true, isVerified: true }
        });

        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ kycStatus: user.kycStatus, isVerified: user.isVerified, docs: user.kycDocs });
    } catch (error) {
        console.error("Error fetching KYC status:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// ✅ SUBMIT KYC DOCS
router.post("/submit", verifyToken, async (req, res) => {
    try {
        const userId = (req as any).user.id;
        const { docs } = req.body;

        if (!docs || !Array.isArray(docs) || docs.length === 0) {
            return res.status(400).json({ message: "Please provide at least one document URL." });
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                kycStatus: "PENDING",
                kycDocs: docs
            }
        });

        res.json({ message: "KYC documents submitted successfully", kycStatus: user.kycStatus });
    } catch (error) {
        console.error("Error submitting KYC:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
