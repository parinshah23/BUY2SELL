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

export default router;
