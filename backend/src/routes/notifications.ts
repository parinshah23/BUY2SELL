import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../middlewares/authMiddleware";

const router = Router();
const prisma = new PrismaClient();

// Get all notifications for the user
router.get("/", verifyToken, async (req: any, res: any) => {
    try {
        const notifications = await prisma.notification.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: "desc" },
            take: 20, // Limit to recent 20
        });

        // Count unread
        const unreadCount = await prisma.notification.count({
            where: { userId: req.user.id, isRead: false },
        });

        res.json({ notifications, unreadCount });
    } catch (error) {
        res.status(500).json({ error: "Error fetching notifications" });
    }
});

// Mark a single notification as read
router.put("/:id/read", verifyToken, async (req: any, res: any) => {
    try {
        const { id } = req.params;
        await prisma.notification.update({
            where: { id: Number(id) },
            data: { isRead: true },
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Error updating notification" });
    }
});

// Mark all as read
router.put("/read-all", verifyToken, async (req: any, res: any) => {
    try {
        await prisma.notification.updateMany({
            where: { userId: req.user.id, isRead: false },
            data: { isRead: true },
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Error marking all read" });
    }
});

export default router;
