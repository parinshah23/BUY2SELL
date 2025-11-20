import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../middlewares/authMiddleware";

const router = Router();
const prisma = new PrismaClient();

// GET REVIEWS FOR A PRODUCT
router.get("/products/:productId/reviews", async (req, res) => {
    try {
        const productId = parseInt(req.params.productId);

        const reviews = await prisma.review.findMany({
            where: { productId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        res.json({ reviews });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// POST A REVIEW
router.post("/products/:productId/reviews", verifyToken, async (req, res) => {
    try {
        const productId = parseInt(req.params.productId);
        const userId = (req as any).user.id;
        const { rating, comment } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
        }

        // Check if user already reviewed this product
        const existingReview = await prisma.review.findUnique({
            where: {
                productId_userId: {
                    productId,
                    userId
                }
            }
        });

        if (existingReview) {
            return res.status(400).json({ message: "You have already reviewed this product" });
        }

        const review = await prisma.review.create({
            data: {
                rating,
                comment,
                productId,
                userId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true
                    }
                }
            }
        });

        res.status(201).json({ message: "Review submitted successfully", review });
    } catch (error) {
        console.error("Error creating review:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
