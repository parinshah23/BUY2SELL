import { Router } from "express";
import { prisma } from "../lib/prisma";
import { verifyToken } from "../middlewares/authMiddleware";

const router = Router();

// ✅ Get My Addresses
router.get("/", verifyToken, async (req, res) => {
    try {
        const userId = (req as any).user.id;
        const addresses = await prisma.address.findMany({
            where: { userId },
            orderBy: { isDefault: "desc" }, // Default first
        });
        res.json({ addresses });
    } catch (error) {
        console.error("Error fetching addresses:", error);
        res.status(500).json({ message: "Failed to fetch addresses" });
    }
});

// ✅ Add Address
router.post("/", verifyToken, async (req, res) => {
    try {
        const userId = (req as any).user.id;
        const { name, street, city, state, zip, country, isDefault } = req.body;

        if (!name || !street || !city || !zip || !country) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // If setting as default, unset other defaults
        if (isDefault) {
            await prisma.address.updateMany({
                where: { userId, isDefault: true },
                data: { isDefault: false },
            });
        }

        const address = await prisma.address.create({
            data: {
                userId,
                name,
                street,
                city,
                state: state || "",
                zip,
                country,
                isDefault: isDefault || false,
            },
        });

        res.status(201).json({ message: "Address added", address });
    } catch (error) {
        console.error("Error adding address:", error);
        res.status(500).json({ message: "Failed to add address" });
    }
});

// ✅ Delete Address
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const userId = (req as any).user.id;
        const addressId = parseInt(req.params.id);

        const address = await prisma.address.findUnique({ where: { id: addressId } });
        if (!address) return res.status(404).json({ message: "Address not found" });
        if (address.userId !== userId) return res.status(403).json({ message: "Unauthorized" });

        await prisma.address.delete({ where: { id: addressId } });
        res.json({ message: "Address deleted" });
    } catch (error) {
        console.error("Error deleting address:", error);
        res.status(500).json({ message: "Failed to delete address" });
    }
});

export default router;
