import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../middlewares/authMiddleware";

const router = Router();
const prisma = new PrismaClient();

// ✅ Create or Get Chat
router.post("/", verifyToken, async (req, res) => {
    try {
        const { productId, sellerId } = req.body;
        const buyerId = (req as any).user.id;

        if (!productId || !sellerId) {
            return res.status(400).json({ message: "Product ID and Seller ID required" });
        }

        if (buyerId === sellerId) {
            return res.status(400).json({ message: "You cannot chat with yourself" });
        }

        // Check if chat exists
        let chat = await prisma.chat.findUnique({
            where: {
                productId_buyerId_sellerId: {
                    productId: Number(productId),
                    buyerId,
                    sellerId: Number(sellerId),
                },
            },
        });

        // If not, create new chat
        if (!chat) {
            chat = await prisma.chat.create({
                data: {
                    productId: Number(productId),
                    buyerId,
                    sellerId: Number(sellerId),
                },
            });
        }

        res.json({ message: "Chat initialized", chat });
    } catch (error) {
        console.error("Error creating chat:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// ✅ Get All Chats for User (Buyer or Seller)
router.get("/", verifyToken, async (req, res) => {
    try {
        const userId = (req as any).user.id;

        const chats = await prisma.chat.findMany({
            where: {
                OR: [{ buyerId: userId }, { sellerId: userId }],
            },
            include: {
                product: { select: { id: true, title: true, images: true } },
                buyer: { select: { id: true, name: true } },
                seller: { select: { id: true, name: true } },
                messages: {
                    orderBy: { createdAt: "desc" },
                    take: 1, // Get latest message
                },
            },
            orderBy: { updatedAt: "desc" },
        });

        res.json({ chats });
    } catch (error) {
        console.error("Error fetching chats:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// ✅ Get Messages for a Chat
router.get("/:id", verifyToken, async (req, res) => {
    try {
        const chatId = Number(req.params.id);
        const userId = (req as any).user.id;

        // Verify user is part of the chat
        const chat = await prisma.chat.findUnique({
            where: { id: chatId },
        });

        if (!chat || (chat.buyerId !== userId && chat.sellerId !== userId)) {
            return res.status(403).json({ message: "Access denied" });
        }

        const messages = await prisma.message.findMany({
            where: { chatId },
            orderBy: { createdAt: "asc" },
            include: {
                sender: { select: { id: true, name: true } },
            },
        });

        res.json({ messages });
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// ✅ Send Message
router.post("/:id/messages", verifyToken, async (req, res) => {
    try {
        const chatId = Number(req.params.id);
        const { content } = req.body;
        const senderId = (req as any).user.id;

        if (!content) return res.status(400).json({ message: "Message content required" });

        // Verify user is part of the chat
        const chat = await prisma.chat.findUnique({
            where: { id: chatId },
        });

        if (!chat || (chat.buyerId !== senderId && chat.sellerId !== senderId)) {
            return res.status(403).json({ message: "Access denied" });
        }

        const message = await prisma.message.create({
            data: {
                chatId,
                senderId,
                content,
            },
        });

        // Update chat timestamp
        await prisma.chat.update({
            where: { id: chatId },
            data: { updatedAt: new Date() },
        });

        res.status(201).json({ message: "Message sent", data: message });
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
