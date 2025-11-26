import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
    try {
        const [totalProducts, totalOrders, totalUsers, products] = await Promise.all([
            prisma.product.count(),
            prisma.order.count(),
            prisma.user.count(),
            prisma.product.findMany({
                select: { price: true },
            }),
        ]);

        const totalInventoryValue = products.reduce((acc, product) => acc + product.price, 0);

        res.json({
            totalProducts,
            totalOrders,
            totalUsers,
            totalInventoryValue,
        });
    } catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
