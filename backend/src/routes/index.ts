import { Router } from "express";

const router = Router();

router.get("/health", (_, res) => {
  res.json({ status: "success", message: "Server is healthy ✅" });
});
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

router.get("/users", async (_, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json({ status: "success", data: users });
  } catch (error) {
    console.error("Database connection failed:", error);
    res.status(500).json({ status: "error", message: "Database error" });
  }
});

export default router;
