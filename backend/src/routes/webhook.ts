import { Router } from "express";
import { OrderStatus, TransactionType, ProductStatus, PaymentMethod } from "@prisma/client";
import { prisma } from "../lib/prisma";
import Stripe from "stripe";
import express from "express";
import { sendEmail } from "../lib/mail";

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
        // Metadata is always string values
        const { productId, buyerId, sellerId, addressId, protectionFee, shippingCost, amount } = session.metadata!;

        console.log("✅ Payment Successful for Product:", productId);

        try {
            const orderAmount = parseFloat(amount); // This is TOTAL (Item + Fees)
            const fee = parseFloat(protectionFee);
            const shipping = parseFloat(shippingCost);

            // Fetch Address for Snapshot
            const address = await prisma.address.findUnique({ where: { id: parseInt(addressId) } });

            // Seller Earnings = Total - Fees - Shipping = Product Price
            // OR simpler: Seller Earnings = Product Price (which we can infer or fetch)
            // Let's rely on the math: Earnings = Total - Protection - Shipping
            const sellerEarnings = orderAmount - fee - shipping;

            await prisma.$transaction(async (tx) => {
                // Create Order
                await tx.order.create({
                    data: {
                        productId: parseInt(productId),
                        buyerId: parseInt(buyerId),
                        sellerId: parseInt(sellerId),
                        totalAmount: orderAmount,
                        platformFee: fee,
                        sellerEarnings: sellerEarnings,
                        shippingCost: shipping,
                        protectionFee: fee,
                        shippingAddress: address as any,
                        status: OrderStatus.PAID,
                        paymentMethod: PaymentMethod.STRIPE,
                        stripeSessionId: session.id,
                        paymentIntentId: session.payment_intent as string,
                    },
                });

                // Update Product Stock
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

            // Send Emails (Non-blocking)
            const [buyer, seller] = await Promise.all([
                prisma.user.findUnique({ where: { id: parseInt(buyerId) } }),
                prisma.user.findUnique({ where: { id: parseInt(sellerId) } })
            ]);

            if (buyer?.email) {
                sendEmail({
                    to: buyer.email,
                    subject: "Order Confirmation - Buy2Sell",
                    html: `<h1>Order Confirmed! 🎉</h1><p>You purchased product #${productId} for $${amount}.</p><p>You can track your order in your dashboard.</p>`
                }).catch(err => console.error("Failed to email buyer:", err));
            }

            if (seller?.email) {
                sendEmail({
                    to: seller.email,
                    subject: "New Sale! 💰 - Buy2Sell",
                    html: `<h1>You made a sale!</h1><p>Product #${productId} was sold for $${sellerEarnings.toFixed(2)}.</p><p>Funds have been added to your pending balance.</p>`
                }).catch(err => console.error("Failed to email seller:", err));
            }

            // Create In-App Notifications
            await prisma.notification.createMany({
                data: [
                    {
                        userId: parseInt(buyerId),
                        title: "Order Confirmed",
                        message: `You successfully purchased product #${productId}.`,
                        type: "ORDER", // NotificationType.ORDER
                        link: "/user/orders"
                    },
                    {
                        userId: parseInt(sellerId),
                        title: "New Sale! 💰",
                        message: `You sold product #${productId} for $${sellerEarnings.toFixed(2)}.`,
                        type: "ORDER",
                        link: "/user/wallet"
                    }
                ]
            });

        } catch (error) {
            console.error("❌ Error processing webhook:", error);
            return res.status(500).json({ error: "Database transaction failed" });
        }
    }

    res.json({ received: true });
});

export default router;
