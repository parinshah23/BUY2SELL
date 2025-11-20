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

export default router;
