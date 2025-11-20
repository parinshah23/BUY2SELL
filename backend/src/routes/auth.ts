import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";
import { verifyToken } from "../middlewares/authMiddleware";

dotenv.config();
const router = Router();
const prisma = new PrismaClient();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
      select: { id: true, name: true, email: true, createdAt: true },
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        isAdmin: true,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const jwtSecret: Secret = process.env.JWT_SECRET as Secret;
    const token = jwt.sign(
      { id: user.id, email: user.email, isAdmin: user.isAdmin || false },
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" } as SignOptions
    );


    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// PROTECTED ROUTE - GET CURRENT USER
router.get("/me", verifyToken, async (req, res) => {
  try {
    const userData = (req as any).user; // set by middleware

    const user = await prisma.user.findUnique({
      where: { id: userData.id },
      select: { id: true, name: true, email: true, avatar: true, bio: true, createdAt: true },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User data fetched successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// LOGOUT (Frontend handled, but route provided for UX)
router.post("/logout", (req, res) => {
  res.json({ message: "Logged out successfully" });
});

export default router;
