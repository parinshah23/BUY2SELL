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

export default router;
