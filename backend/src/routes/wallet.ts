import { Router } from "express";
import { prisma } from "../lib/prisma";
import { verifyToken } from "../middlewares/authMiddleware";

const router = Router();

// ✅ Get Wallet Balance & Transactions
router.get("/", verifyToken, async (req, res) => {
    try {
        const userId = (req as any).user.id;

        // Get or Create Wallet
        let wallet = await prisma.wallet.findUnique({
            where: { userId },
            include: {
                transactions: {
                    orderBy: { createdAt: "desc" },
                    take: 20
                }
            },
        });

        if (!wallet) {
            wallet = await prisma.wallet.create({
                data: { userId },
                include: { transactions: true },
            });
        }

        res.json({ wallet });
    } catch (error) {
        console.error("Error fetching wallet:", error);
        res.status(500).json({ message: "Failed to fetch wallet details" });
    }
});

// ✅ Request Withdrawal (Mock)
router.post("/withdraw", verifyToken, async (req, res) => {
    try {
        const userId = (req as any).user.id;
        const { amount } = req.body;

        const wallet = await prisma.wallet.findUnique({ where: { userId } });
        if (!wallet) return res.status(404).json({ message: "Wallet not found" });

        if (wallet.balance < amount) {
            return res.status(400).json({ message: "Insufficient funds" });
        }

        // Deduct mocked withdrawal
        await prisma.$transaction(async (tx) => {
            await tx.wallet.update({
                where: { userId },
                data: { balance: { decrement: amount } }
            });

            await tx.walletTransaction.create({
                data: {
                    walletId: wallet.id,
                    amount: amount,
                    type: "WITHDRAWAL",
                    description: "Payout to Bank Account (Simulated)",
                }
            });
        });

        res.json({ message: "Withdrawal processed successfully" });

    } catch (error) {
        console.error("Error processing withdrawal:", error);
        res.status(500).json({ message: "Withdrawal failed" });
    }
});

export default router;
