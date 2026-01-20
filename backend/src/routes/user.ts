import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../middlewares/authMiddleware";

const router = Router();
const prisma = new PrismaClient();

// UPDATE USER PROFILE
router.put("/profile", verifyToken, async (req, res) => {
    try {
        const userId = (req as any).user.id;
        const { name, bio, avatar } = req.body;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                name,
                bio,
                avatar,
            },
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                bio: true,
                createdAt: true,
            },
        });

        res.json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// ✅ BLOCK USER
router.post("/:id/block", verifyToken, async (req, res) => {
    try {
        const blockerId = (req as any).user.id;
        const blockedId = Number(req.params.id);

        if (blockerId === blockedId) {
            return res.status(400).json({ message: "You cannot block yourself" });
        }

        await prisma.block.create({
            data: {
                blockerId,
                blockedId,
            },
        });

        res.json({ message: "User blocked successfully" });
    } catch (error) {
        // Unique constraint failed = already blocked
        if ((error as any).code === 'P2002') {
            return res.status(400).json({ message: "User already blocked" });
        }
        console.error("Error blocking user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// ✅ UNBLOCK USER
router.delete("/:id/block", verifyToken, async (req, res) => {
    try {
        const blockerId = (req as any).user.id;
        const blockedId = Number(req.params.id);

        await prisma.block.deleteMany({
            where: {
                blockerId,
                blockedId,
            },
        });

        res.json({ message: "User unblocked successfully" });
    } catch (error) {
        console.error("Error unblocking user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// ✅ REPORT USER
router.post("/:id/report", verifyToken, async (req, res) => {
    try {
        const reporterId = (req as any).user.id;
        const reportedId = Number(req.params.id);
        const { reason } = req.body;

        if (!reason) {
            return res.status(400).json({ message: "Reason is required" });
        }

        await prisma.report.create({
            data: {
                reporterId,
                reportedId,
                reason,
            },
        });

        res.json({ message: "User reported successfully" });
    } catch (error) {
        console.error("Error reporting user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// ✅ GET BLOCKED USERS
router.get("/blocked", verifyToken, async (req, res) => {
    try {
        const userId = (req as any).user.id;

        const blockedUsers = await prisma.block.findMany({
            where: { blockerId: userId },
            include: {
                blocked: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true
                    }
                }
            }
        });

        res.json({ blockedUsers: blockedUsers.map(b => b.blocked) });
    } catch (error) {
        console.error("Error fetching blocked users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// ✅ GET / UPDATE Bundle Settings
router.get("/bundle-settings", verifyToken, async (req, res) => {
    try {
        const userId = (req as any).user.id;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { bundleSettings: true }
        });
        res.json({ bundleSettings: user?.bundleSettings || null });
    } catch (error) {
        console.error("Error fetching bundle settings:", error);
        res.status(500).json({ message: "Failed to fetch settings" });
    }
});

router.put("/bundle-settings", verifyToken, async (req, res) => {
    try {
        const userId = (req as any).user.id;
        const { bundleSettings } = req.body; // Expect JSON object

        // Validate structure if needed (e.g. key=quantity(int), value=discount(int))

        await prisma.user.update({
            where: { id: userId },
            data: { bundleSettings }
        });

        res.json({ success: true, message: "Bundle discounts updated" });
    } catch (error) {
        console.error("Error updating bundle settings:", error);
        res.status(500).json({ message: "Failed to update settings" });
    }
});

export default router;
