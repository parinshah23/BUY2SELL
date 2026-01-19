import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { verifyToken, isAdmin } from "../middlewares/authMiddleware";

const router = Router();
const prisma = new PrismaClient();

// GET DASHBOARD STATS
router.get("/stats", verifyToken, isAdmin, async (req, res) => {
    try {
        const totalUsers = await prisma.user.count();
        const totalProducts = await prisma.product.count();
        const totalOrders = await prisma.order.count();

        // Calculate total revenue (sum of prices of products in orders)
        const revenueResult = await prisma.order.findMany({
            include: {
                product: {
                    select: {
                        price: true
                    }
                }
            }
        });

        const totalRevenue = revenueResult.reduce((acc, order) => acc + order.product.price, 0);

        res.json({
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue
        });
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// ✅ GET ALL USERS
router.get("/users", verifyToken, isAdmin, async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                isAdmin: true,
                createdAt: true,
                avatar: true
            },
            orderBy: { createdAt: "desc" }
        });
        res.json({ users });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// ✅ DELETE USER
router.delete("/users/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const userId = Number(req.params.id);

        // Prevent deleting yourself
        if (userId === (req as any).user.id) {
            return res.status(400).json({ message: "You cannot delete yourself" });
        }

        await prisma.user.delete({ where: { id: userId } });
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// ==========================================
// 🛡️ PRODUCT MODERATION ROUTES
// ==========================================

// ✅ GET PENDING PRODUCTS
router.get("/products/pending", verifyToken, isAdmin, async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            where: { moderationStatus: "PENDING" },
            include: { user: { select: { name: true, email: true } } },
            orderBy: { createdAt: "desc" }
        });
        res.json({ products });
    } catch (error) {
        console.error("Error fetching pending products:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// ✅ APPROVE PRODUCT
router.post("/products/:id/approve", verifyToken, isAdmin, async (req, res) => {
    try {
        const productId = Number(req.params.id);
        const product = await prisma.product.update({
            where: { id: productId },
            data: { moderationStatus: "APPROVED" }
        });
        res.json({ message: "Product approved successfully", product });
    } catch (error) {
        console.error("Error approving product:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// ✅ REJECT PRODUCT
router.post("/products/:id/reject", verifyToken, isAdmin, async (req, res) => {
    try {
        const productId = Number(req.params.id);
        await prisma.product.update({
            where: { id: productId },
            data: { moderationStatus: "REJECTED" }
        });
        res.json({ message: "Product rejected successfully" });
    } catch (error) {
        console.error("Error rejecting product:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// ==========================================
// 🆔 KYC MODERATION ROUTES
// ==========================================

// ✅ GET PENDING KYC REQUESTS
router.get("/kyc/pending", verifyToken, isAdmin, async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            where: { kycStatus: "PENDING" },
            select: {
                id: true,
                name: true,
                email: true,
                kycStatus: true,
                kycDocs: true,
                createdAt: true
            },
            orderBy: { createdAt: "desc" }
        });
        res.json({ users });
    } catch (error) {
        console.error("Error fetching pending KYC:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// ✅ APPROVE KYC
router.post("/kyc/:id/approve", verifyToken, isAdmin, async (req, res) => {
    try {
        const userId = Number(req.params.id);
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                kycStatus: "VERIFIED",
                isVerified: true
            }
        });
        res.json({ message: "User KYC verified successfully", user });
    } catch (error) {
        console.error("Error approving KYC:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// ✅ REJECT KYC
router.post("/kyc/:id/reject", verifyToken, isAdmin, async (req, res) => {
    try {
        const userId = Number(req.params.id);
        await prisma.user.update({
            where: { id: userId },
            data: {
                kycStatus: "REJECTED",
                isVerified: false
            }
        });
        res.json({ message: "User KYC rejected" });
    } catch (error) {
        console.error("Error rejecting KYC:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
