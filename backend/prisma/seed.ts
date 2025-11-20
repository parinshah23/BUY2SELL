import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Starting seeding...");

    // Cleanup existing data
    await prisma.message.deleteMany();
    await prisma.chat.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();

    // Create Users
    const password = await bcrypt.hash("password123", 10);

    const users = [
        { name: "Hans Müller", email: "hans@example.com", isAdmin: false },
        { name: "Amelie Dubois", email: "amelie@example.com", isAdmin: false },
        { name: "Matteo Rossi", email: "matteo@example.com", isAdmin: false },
        { name: "Sofia Garcia", email: "sofia@example.com", isAdmin: false },
        { name: "Lukas Schmidt", email: "lukas@example.com", isAdmin: false },
        { name: "Admin User", email: "admin@buy2sell.com", isAdmin: true },
    ];

    const createdUsers = [];
    for (const u of users) {
        const user = await prisma.user.create({
            data: { ...u, password },
        });
        createdUsers.push(user);
        console.log(`👤 Created user: ${user.name}`);
    }

    // European Cities
    const locations = [
        { city: "Berlin, Germany", lat: 52.52, lng: 13.405 },
        { city: "Paris, France", lat: 48.8566, lng: 2.3522 },
        { city: "Rome, Italy", lat: 41.9028, lng: 12.4964 },
        { city: "Madrid, Spain", lat: 40.4168, lng: -3.7038 },
        { city: "Amsterdam, Netherlands", lat: 52.3676, lng: 4.9041 },
        { city: "Vienna, Austria", lat: 48.2082, lng: 16.3738 },
        { city: "Prague, Czech Republic", lat: 50.0755, lng: 14.4378 },
        { city: "Warsaw, Poland", lat: 52.2297, lng: 21.0122 },
    ];

    // Products
    const products = [
        {
            title: "Vintage Leica Camera",
            description: "Classic M3 model in excellent condition. Fully functional.",
            price: 1200,
            category: "Electronics",
            images: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80"],
        },
        {
            title: "Designer Leather Handbag",
            description: "Authentic Italian leather bag, barely used.",
            price: 350,
            category: "Fashion",
            images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80"],
        },
        {
            title: "Modern Sofa Set",
            description: "Comfortable grey sofa, perfect for a modern living room.",
            price: 450,
            category: "Furniture",
            images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80"],
        },
        {
            title: "Electric Scooter",
            description: "Xiaomi Mi Electric Scooter, good battery life.",
            price: 250,
            category: "Vehicles",
            images: ["https://images.unsplash.com/photo-1591635566278-10dca0ca76ee?w=800&q=80"],
        },
        {
            title: "MacBook Pro M1",
            description: "13-inch, 8GB RAM, 256GB SSD. Like new.",
            price: 900,
            category: "Electronics",
            images: ["https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80"],
        },
        {
            title: "Antique Wooden Table",
            description: "Hand-carved oak table from the 19th century.",
            price: 800,
            category: "Furniture",
            images: ["https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800&q=80"],
        },
        {
            title: "Road Bike",
            description: "Carbon fiber frame, Shimano gears. Ready to race.",
            price: 1500,
            category: "Sports",
            images: ["https://images.unsplash.com/photo-1485965120184-e224f723d621?w=800&q=80"],
        },
        {
            title: "First Edition Book",
            description: "Rare copy of a classic novel.",
            price: 200,
            category: "Books",
            images: ["https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80"],
        },
    ];

    // Create Products randomly assigned to users and locations
    for (let i = 0; i < 50; i++) {
        const productTemplate = products[Math.floor(Math.random() * products.length)];
        const user = createdUsers[Math.floor(Math.random() * createdUsers.length)];
        const location = locations[Math.floor(Math.random() * locations.length)];

        // Add some variation to price and title
        const price = productTemplate.price + Math.floor(Math.random() * 50) - 25;

        await prisma.product.create({
            data: {
                title: productTemplate.title,
                description: productTemplate.description,
                price: price,
                category: productTemplate.category,
                images: productTemplate.images,
                location: location.city,
                latitude: location.lat,
                longitude: location.lng,
                userId: user.id,
                status: "AVAILABLE",
            },
        });
    }

    console.log("✅ Seeding finished.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
