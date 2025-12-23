import { Router } from "express";
import { prisma } from "../lib/prisma";
import Stripe from "stripe";
import { verifyToken } from "../middlewares/authMiddleware";

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2024-12-18.acacia" as any,
});

// ✅ Create Checkout Session (Buy Now)
router.post("/checkout", verifyToken, async (req, res) => {
    try {
        const { productId } = req.body;
        const buyerId = (req as any).user.id;

        const product = await prisma.product.findUnique({
            where: { id: productId },
            include: { user: true },
        });

        if (!product) return res.status(404).json({ message: "Product not found" });
        if (product.userId === buyerId) return res.status(400).json({ message: "Cannot buy your own product" });
        if (product.status === "SOLD") return res.status(400).json({ message: "Product already sold" });

        // Calculate Fees (Platform Fee: 4%)
        const platformFeePercent = 0.04;
        const amount = product.price;

        // Create Stripe Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: product.title,
                            images: product.images.length > 0 ? [product.images[0]] : [],
                        },
                        unit_amount: Math.round(amount * 100), // Convert to cents
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${process.env.FRONTEND_URL || "http://localhost:3000"}/orders/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL || "http://localhost:3000"}/products/${product.id}`,
            metadata: {
                productId: product.id.toString(),
                buyerId: buyerId.toString(),
                sellerId: product.userId.toString(),
                amount: amount.toString(),
            },
            payment_intent_data: {
                metadata: {
                    productId: product.id.toString(),
                    buyerId: buyerId.toString(),
                    sellerId: product.userId.toString(),
                }
            }
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error("Checkout error:", error);
        res.status(500).json({ message: "Failed to create checkout session" });
    }
});

// ✅ Get My Orders (As Buyer)
router.get("/my-orders", verifyToken, async (req, res) => {
    try {
        const userId = (req as any).user.id;
        const orders = await prisma.order.findMany({
            where: { buyerId: userId },
            include: {
                product: { select: { id: true, title: true, images: true, price: true } },
                seller: { select: { name: true, email: true } }
            },
            orderBy: { createdAt: "desc" },
        });
        res.json({ orders });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch orders" });
    }
});

// ✅ Get My Sales (As Seller)
router.get("/my-sales", verifyToken, async (req, res) => {
    try {
        const userId = (req as any).user.id;
        const sales = await prisma.order.findMany({
            where: { sellerId: userId },
            include: {
                product: { select: { id: true, title: true, images: true, price: true } },
                buyer: { select: { name: true, email: true } }
            },
            orderBy: { createdAt: "desc" },
        });
        res.json({ sales });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch sales" });
    }
});

// ✅ Update Order Status (Ship, Deliver, Confirm)
router.put("/:id/status", verifyToken, async (req, res) => {
    try {
        const orderId = parseInt(req.params.id);
        const { status } = req.body; // Expect: SHIPPED, DELIVERED, COMPLETED
        const userId = (req as any).user.id;

        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { buyer: true, seller: true },
        });

        if (!order) return res.status(404).json({ message: "Order not found" });

        // 1. Seller Logic (Mark Shipped/Delivered)
        if (status === "SHIPPED" || status === "DELIVERED") {
            if (order.sellerId !== userId) return res.status(403).json({ message: "Only seller can update shipping status" });

            await prisma.order.update({
                where: { id: orderId },
                data: { status },
            });

            return res.json({ message: `Order marked as ${status}` });
        }

        // 2. Buyer Logic (Confirm Receipt -> Trigger Payout to Seller)
        if (status === "COMPLETED") {
            if (order.buyerId !== userId) return res.status(403).json({ message: "Only buyer can confirm receipt" });

            await prisma.$transaction(async (tx) => {
                // Update Order
                await tx.order.update({
                    where: { id: orderId },
                    data: { status: "COMPLETED" },
                });

                // Move Funds in Seller Wallet (Pending -> Available)
                // Note: We already credited 'pending' in webhook. Now we move it to 'balance'.
                const sellerWallet = await tx.wallet.findUnique({ where: { userId: order.sellerId } });

                if (sellerWallet) {
                    await tx.wallet.update({
                        where: { userId: order.sellerId },
                        data: {
                            pending: { decrement: order.sellerEarnings },
                            balance: { increment: order.sellerEarnings }
                        }
                    });

                    // Log Transaction
                    await tx.walletTransaction.create({
                        data: {
                            walletId: sellerWallet.id,
                            amount: order.sellerEarnings,
                            type: "DEPOSIT", // Or SALE_COMPLETED
                            description: `Earnings released for Order #${order.id}`,
                        }
                    });
                }
            });

            return res.json({ message: "Order completed and funds released to seller" });
        }

        res.status(400).json({ message: "Invalid status update" });

    } catch (error) {
        console.error("Error updating status:", error);
        res.status(500).json({ message: "Failed to update status" });
    }
});

export default router;
