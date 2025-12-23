import { Router } from "express";
import { OrderStatus, TransactionType, ProductStatus } from "@prisma/client";
import { prisma } from "../lib/prisma";
import Stripe from "stripe";
import express from "express";

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2024-12-18.acacia" as any,
});

// ✅ Webhook Handler (Must use raw body parser in app.ts or specific route)
router.post("/", express.raw({ type: "application/json" }), async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        if (!endpointSecret || !sig) throw new Error("Missing secret or signature");
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err: any) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle Events
    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const { productId, buyerId, sellerId, amount } = session.metadata!;

        console.log("✅ Payment Successful for Product:", productId);

        try {
            // 1. Create Order
            const orderAmount = parseFloat(amount);
            const platformFee = orderAmount * 0.04;
            const sellerEarnings = orderAmount - platformFee;

            await prisma.$transaction(async (tx) => {
                // Create Order
                await tx.order.create({
                    data: {
                        productId: parseInt(productId),
                        buyerId: parseInt(buyerId),
                        sellerId: parseInt(sellerId),
                        totalAmount: orderAmount,
                        platformFee,
                        sellerEarnings,
                        status: OrderStatus.PAID,
                        stripeSessionId: session.id,
                        paymentIntentId: session.payment_intent as string,
                    },
                });

                // Update Product Stock
                // Logic: Decrement stock. If it hits 0, mark as SOLD.
                const product = await tx.product.findUnique({ where: { id: parseInt(productId) } });

                if (product) {
                    const newStock = Math.max(0, product.stock - 1);
                    const newStatus = newStock === 0 ? ProductStatus.SOLD : ProductStatus.AVAILABLE;

                    await tx.product.update({
                        where: { id: parseInt(productId) },
                        data: {
                            stock: newStock,
                            status: newStatus
                        },
                    });
                }

                // Create/Update Seller Wallet (PENDING Balance)
                const wallet = await tx.wallet.upsert({
                    where: { userId: parseInt(sellerId) },
                    update: { pending: { increment: sellerEarnings } },
                    create: { userId: parseInt(sellerId), pending: sellerEarnings, balance: 0 },
                });

                // Log Transaction
                await tx.walletTransaction.create({
                    data: {
                        walletId: wallet.id,
                        amount: sellerEarnings,
                        type: TransactionType.SALE,
                        description: `Sale of product #${productId} (Pending)`,
                    },
                });
            });

            console.log("✅ Order & Wallet Updated");
        } catch (error) {
            console.error("❌ Error processing webhook:", error);
            return res.status(500).json({ error: "Database transaction failed" });
        }
    }

    res.json({ received: true });
});

export default router;
