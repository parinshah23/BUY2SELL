import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../middlewares/authMiddleware";

const router = Router();
const prisma = new PrismaClient();

// GET USER ORDERS (purchases and sales)
router.get("/orders", verifyToken, async (req, res) => {
    try {
        const userId = (req as any).user.id;

        // Get purchases (orders where user is the buyer)
        const purchases = await prisma.order.findMany({
            where: { buyerId: userId },
            include: {
                product: {
                    select: {
                        id: true,
                        title: true,
                        price: true,
                        images: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        // Get sales (orders where user is the seller of the product)
        const sales = await prisma.order.findMany({
            where: {
                product: {
                    userId: userId
                }
            },
            include: {
                product: {
                    select: {
                        id: true,
                        title: true,
                        price: true,
                        images: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        res.json({ purchases, sales });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
