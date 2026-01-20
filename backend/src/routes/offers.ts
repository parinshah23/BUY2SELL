import { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { verifyToken } from "../middlewares/authMiddleware";
import { OfferStatus, NotificationType } from "@prisma/client";

const router = Router();

// ✅ Create Offer (Buyer or Seller)
router.post("/", verifyToken, async (req: Request, res: Response) => {
    try {
        const { productId, amount } = req.body;
        const senderId = (req as any).user.id;

        const product = await prisma.product.findUnique({ where: { id: parseInt(productId) } });
        if (!product) return res.status(404).json({ message: "Product not found" });

        // Logic Change: Allow Seller to make offer (Counter Offer)
        const isSeller = product.userId === senderId;

        if (product.status === "SOLD") return res.status(400).json({ message: "Product is sold" });

        // If Buyer, check if not own product (already covered by isSeller check logic flow below)
        if (!isSeller && product.userId === senderId) {
            return res.status(400).json({ message: "Cannot make offer on your own product" });
        }

        // If it's a counter offer, we need to know who the "buyer" is. 
        // For now, let's assume if Seller creates it, they must pass a buyerId or we find the last open offer? 
        // Simplified: The UI will pass `buyerId` if it's a counter offer.

        let buyerId = (req.body.buyerId) ? parseInt(req.body.buyerId) : senderId;

        // If Seller is sending, they must specify who they are offering TO.
        if (isSeller && !req.body.buyerId) {
            return res.status(400).json({ message: "Buyer ID required for counter offer" });
        }

        // If Buyer is sending, buyerId is themselves
        if (!isSeller) {
            buyerId = senderId;
        }

        const offer = await prisma.offer.create({
            data: {
                amount: parseFloat(amount),
                productId: parseInt(productId),
                buyerId,
                senderId,
                status: OfferStatus.PENDING
            }
        });

        // Notify Recipient
        const recipientId = isSeller ? buyerId : product.userId;
        const title = isSeller ? "Counter Offer Received" : "New Offer Received";
        const message = isSeller
            ? `Seller offered €${amount} for ${product.title}`
            : `You received an offer of €${amount} for ${product.title}`;

        await prisma.notification.create({
            data: {
                userId: recipientId,
                type: NotificationType.SYSTEM,
                title,
                message,
                link: `/user/products/${product.id}` // Link to product/chat
            }
        });

        res.json({ success: true, offer });
    } catch (error) {
        console.error("Create offer error:", error);
        res.status(500).json({ message: "Failed to create offer" });
    }
});

// ✅ Get Offers for Product (Seller View or Buyer View)
router.get("/product/:productId", verifyToken, async (req: Request, res: Response) => {
    try {
        const productId = parseInt(req.params.productId);
        const userId = (req as any).user.id;

        const product = await prisma.product.findUnique({ where: { id: productId } });
        if (!product) return res.status(404).json({ message: "Product not found" });

        // Allow Seller OR Buyer involved in offers to see them
        // Note: Use simple check. If seller -> see all. If buyer -> see only yours? 
        // For Vinted style, offers are usually in chat. Here we list them.

        let whereCondition: any = { productId };
        if (product.userId !== userId) {
            // If checking as buyer, only see offers where I am the buyer
            whereCondition.buyerId = userId;
        }

        const offers = await prisma.offer.findMany({
            where: whereCondition,
            include: {
                buyer: { select: { id: true, name: true, avatar: true } },
                sender: { select: { id: true, name: true } } // Include sender info
            },
            orderBy: { createdAt: "desc" }
        });

        res.json({ offers });
    } catch (error) {
        console.error("Get offers error:", error);
        res.status(500).json({ message: "Failed to fetch offers" });
    }
});

// ✅ Accept Offer (Seller OR Buyer)
router.put("/:id/accept", verifyToken, async (req: Request, res: Response) => {
    try {
        const offerId = parseInt(req.params.id);
        const userId = (req as any).user.id;

        const offer = await prisma.offer.findUnique({
            where: { id: offerId },
            include: { product: true }
        });

        if (!offer) return res.status(404).json({ message: "Offer not found" });

        // Determine who can accept
        // If Sender was Seller -> Buyer can accept
        // If Sender was Buyer -> Seller can accept

        const isSeller = offer.product.userId === userId;
        const isBuyer = offer.buyerId === userId;
        const senderId = offer.senderId || offer.buyerId; // Fallback for old data

        if (userId === senderId) {
            return res.status(400).json({ message: "Cannot accept your own offer" });
        }

        if (!isSeller && !isBuyer) {
            return res.status(403).json({ message: "Not authorized" });
        }

        // Update Offer Status
        const updatedOffer = await prisma.offer.update({
            where: { id: offerId },
            data: { status: OfferStatus.ACCEPTED }
        });

        // Notify Sender
        await prisma.notification.create({
            data: {
                userId: senderId,
                type: NotificationType.SYSTEM,
                title: "Offer Accepted!",
                message: `Your offer of €${offer.amount} for ${offer.product.title} was accepted!`,
                link: `/orders/checkout/${offer.product.id}`
            }
        });

        res.json({ success: true, offer: updatedOffer });
    } catch (error) {
        console.error("Accept offer error:", error);
        res.status(500).json({ message: "Failed to accept offer" });
    }
});

// ✅ Reject Offer
router.put("/:id/reject", verifyToken, async (req: Request, res: Response) => {
    try {
        const offerId = parseInt(req.params.id);
        const userId = (req as any).user.id;

        const offer = await prisma.offer.findUnique({
            where: { id: offerId },
            include: { product: true }
        });

        if (!offer) return res.status(404).json({ message: "Offer not found" });

        const isSeller = offer.product.userId === userId;
        const isBuyer = offer.buyerId === userId;

        if (!isSeller && !isBuyer) return res.status(403).json({ message: "Not authorized" });

        const updatedOffer = await prisma.offer.update({
            where: { id: offerId },
            data: { status: OfferStatus.REJECTED }
        });

        res.json({ success: true, offer: updatedOffer });
    } catch (error) {
        console.error("Reject offer error:", error);
        res.status(500).json({ message: "Failed to reject offer" });
    }
});

export default router;
