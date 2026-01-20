import { Router } from "express";
import { prisma } from "../lib/prisma";
import Stripe from "stripe";
import { verifyToken } from "../middlewares/authMiddleware";
import { PaymentMethod, TransactionType, OrderStatus, ProductStatus } from "@prisma/client";

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2024-12-18.acacia" as any,
});

// Helper to calculate fees
const calculateFees = (price: number) => {
    const protectionFee = price * 0.05 + 0.70; // 5% + $0.70
    const shippingCost = 5.00; // Fixed for now
    return { protectionFee, shippingCost, total: price + protectionFee + shippingCost };
};

// ✅ Preview Order (Fee Breakdown)
router.post("/preview", verifyToken, async (req, res) => {
    try {
        const { productId } = req.body;
        const product = await prisma.product.findUnique({ where: { id: productId } });

        if (!product) return res.status(404).json({ message: "Product not found" });

        const { protectionFee, shippingCost, total } = calculateFees(product.price);

        res.json({
            price: product.price,
            protectionFee,
            shippingCost,
            total
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to preview order" });
    }
});

// ✅ Pay with Wallet
router.post("/pay-with-wallet", verifyToken, async (req, res) => {
    try {
        const { productId, addressId } = req.body;
        const buyerId = (req as any).user.id;

        const product = await prisma.product.findUnique({ where: { id: productId } });
        if (!product) return res.status(404).json({ message: "Product not found" });
        if (product.status === "SOLD") return res.status(400).json({ message: "Product already sold" });
        if (product.userId === buyerId) return res.status(400).json({ message: "Cannot buy your own product" });

        const address = await prisma.address.findUnique({ where: { id: addressId } });
        if (!address) return res.status(400).json({ message: "Invalid address" });

        const { protectionFee, shippingCost, total } = calculateFees(product.price);

        // Check Wallet Balance
        const buyerWallet = await prisma.wallet.findUnique({ where: { userId: buyerId } });
        if (!buyerWallet || buyerWallet.balance < total) {
            return res.status(400).json({ message: "Insufficient wallet balance" });
        }

        await prisma.$transaction(async (tx) => {
            // Deduct from Buyer
            await tx.wallet.update({
                where: { userId: buyerId },
                data: { balance: { decrement: total } }
            });

            await tx.walletTransaction.create({
                data: {
                    walletId: buyerWallet.id,
                    amount: -total,
                    type: TransactionType.SALE, // or PURCHASE
                    description: `Purchase of ${product.title}`,
                }
            });

            // Create Order
            await tx.order.create({
                data: {
                    productId,
                    buyerId,
                    sellerId: product.userId,
                    totalAmount: total,
                    platformFee: protectionFee,
                    sellerEarnings: product.price,
                    shippingCost,
                    protectionFee,
                    shippingAddress: address as any,
                    status: OrderStatus.PAID,
                    paymentMethod: PaymentMethod.WALLET,
                }
            });

            // Update Product
            await tx.product.update({
                where: { id: productId },
                data: { status: ProductStatus.SOLD, stock: { decrement: 1 } }
            });

            // Credit Seller (Pending)
            await tx.wallet.upsert({
                where: { userId: product.userId },
                update: { pending: { increment: product.price } },
                create: { userId: product.userId, pending: product.price, balance: 0 }
            });
        });

        res.json({ success: true, message: "Payment successful" });

    } catch (error) {
        console.error("Wallet payment error:", error);
        res.status(500).json({ message: "Payment failed" });
    }
});

// ✅ Create Checkout Session (Buy Now)
router.post("/checkout", verifyToken, async (req, res) => {
    try {
        const { productId, addressId } = req.body;
        const buyerId = (req as any).user.id;

        const product = await prisma.product.findUnique({
            where: { id: productId },
            include: { user: true },
        });

        if (!product) return res.status(404).json({ message: "Product not found" });
        if (product.userId === buyerId) return res.status(400).json({ message: "Cannot buy your own product" });
        if (product.status === "SOLD") return res.status(400).json({ message: "Product already sold" });

        const address = await prisma.address.findUnique({ where: { id: addressId } });
        if (!address) return res.status(400).json({ message: "Address is required" });

        // Calculate Fees
        const { protectionFee, shippingCost, total } = calculateFees(product.price);

        // Create Stripe Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "eur",
                        product_data: {
                            name: product.title,
                            images: product.images.length > 0 ? [product.images[0]] : [],
                        },
                        unit_amount: Math.round(product.price * 100), // Item Price
                    },
                    quantity: 1,
                },
                {
                    price_data: {
                        currency: "eur",
                        product_data: { name: "Buyer Protection Fee" },
                        unit_amount: Math.round(protectionFee * 100),
                    },
                    quantity: 1,
                },
                {
                    price_data: {
                        currency: "eur",
                        product_data: { name: "Shipping Cost" },
                        unit_amount: Math.round(shippingCost * 100),
                    },
                    quantity: 1,
                }
            ],
            mode: "payment",
            success_url: `${process.env.FRONTEND_URL || "http://localhost:3000"}/orders/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL || "http://localhost:3000"}/products/${product.id}`,
            metadata: {
                productId: product.id.toString(),
                buyerId: buyerId.toString(),
                sellerId: product.userId.toString(),
                addressId: addressId.toString(),
                protectionFee: protectionFee.toString(),
                shippingCost: shippingCost.toString(),
                amount: total.toString(),
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
