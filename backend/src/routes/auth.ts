import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";
import { verifyToken } from "../middlewares/authMiddleware";
import { OAuth2Client } from "google-auth-library";
import { sendEmail } from "../lib/mail";

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

    // Send Welcome Email
    try {
      await sendEmail({
        to: email,
        subject: "Welcome to Buy2Sell! 🚀",
        html: `
          <h1>Welcome, ${name}!</h1>
          <p>We're thrilled to have you on board. Start exploring unique digital assets or selling your own today.</p>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" style="padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px;">Login Now</a>
        `,
      });
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
      // Proceed without failing the request
    }

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

// GOOGLE LOGIN
router.post("/google", async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ message: "Credential required" });
    }

    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      return res.status(400).json({ message: "Invalid Google token" });
    }

    const { email, name, sub: googleId, picture } = payload;

    // Check if user exists by googleId or email
    let user = await prisma.user.findFirst({
      where: {
        OR: [{ googleId }, { email }],
      },
    });

    if (!user) {
      // Create new user
      // Note: We need a password for the model constraint, so we generate a random one
      const dummyPassword = await bcrypt.hash(Math.random().toString(36).slice(-8), 10);
      user = await prisma.user.create({
        data: {
          name: name || "Google User",
          email,
          password: dummyPassword,
          googleId, // Google ID from payload
          avatar: picture,
        },
      });
    } else if (!user.googleId) {
      // Link existing user to Google
      user = await prisma.user.update({
        where: { id: user.id },
        data: { googleId, avatar: user.avatar || picture },
      });
    }

    // Generate JWT
    const jwtSecret: Secret = process.env.JWT_SECRET as Secret;
    const token = jwt.sign(
      { id: user.id, email: user.email, isAdmin: user.isAdmin || false },
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" } as SignOptions
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar },
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(500).json({ message: "Google authentication failed" });
  }
});

export default router;
