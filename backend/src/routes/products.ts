import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../middlewares/authMiddleware";

const router = Router();
const prisma = new PrismaClient();

// CREATE PRODUCT (Protected)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { title, description, price, category, images, location, latitude, longitude } = req.body;
    const userData = (req as any).user; // user info from JWT middleware

    // Validation
    if (!title || !description || !price || !category || !location) {
      return res.status(400).json({ message: "All fields (including location) are required" });
    }

    const product = await prisma.product.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        category,
        images: images || [], // Array of strings
        location,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        userId: userData.id,
      },
    });

    res.status(201).json({
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Get all products with pagination and filtering
router.get("/", async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Number(req.query.limit) || 9);
    const skip = (page - 1) * limit;

    const { search, category, location, sort } = req.query;

    const where: any = {};

    if (search) {
      where.title = { contains: String(search), mode: "insensitive" };
    }

    if (category && category !== "All") {
      where.category = { equals: String(category), mode: "insensitive" };
    }

    if (location) {
      where.location = { contains: String(location), mode: "insensitive" };
    }

    let orderBy: any = { createdAt: "desc" };
    if (sort === "low-high") orderBy = { price: "asc" };
    if (sort === "high-low") orderBy = { price: "desc" };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    const pages = Math.ceil(total / limit);

    res.json({
      message: "Products fetched successfully",
      page,
      pages,
      total,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Error fetching paginated products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// ✅ GET MY PRODUCTS (Paginated)
router.get("/my", verifyToken, async (req, res) => {
  try {
    const userData = (req as any).user;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Number(req.query.limit) || 9);
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: { userId: userData.id },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.product.count({ where: { userId: userData.id } }),
    ]);

    const pages = Math.ceil(total / limit);

    res.json({
      message: "My listings fetched successfully",
      page,
      pages,
      total,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Error fetching user's products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE PRODUCT (Admin or Owner)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const userData = (req as any).user; // from JWT

    // Check if product exists
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Allow deletion if user owns the product OR is an admin
    if (product.userId !== userData.id && !userData.isAdmin) {
      return res.status(403).json({ message: "Unauthorized to delete this product" });
    }

    await prisma.product.delete({ where: { id: productId } });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ UPDATE PRODUCT (Protected)
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, category, images, location } = req.body;
    const userData = (req as any).user; // From JWT middleware

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Ensure the logged-in user owns this product
    if (product.userId !== userData.id) {
      return res.status(403).json({ message: "You are not authorized to update this product" });
    }

    // Update the product
    const updated = await prisma.product.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        price: parseFloat(price),
        category,
        images,
        location,
      },
    });

    res.json({
      message: "Product updated successfully",
      product: updated,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET SINGLE PRODUCT BY ID (Public)
router.get("/:id", async (req, res) => {
  try {
    const productId = parseInt(req.params.id);

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      message: "Product details fetched successfully",
      product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
