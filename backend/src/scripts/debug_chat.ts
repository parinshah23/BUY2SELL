
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Starting Debug Script...");

    // 1. Mock a User ID (replace with a known valid ID from your DB, e.g., 1 or 2)
    const userId = 2;

    try {
        console.log(`Fetching chats for userId: ${userId}`);

        const chats = await prisma.chat.findMany({
            where: {
                OR: [{ buyerId: userId }, { sellerId: userId }],
            },
            include: {
                product: { select: { id: true, title: true, images: true } },
                buyer: { select: { id: true, name: true } },
                seller: { select: { id: true, name: true } },
                messages: {
                    orderBy: { createdAt: "desc" },
                    take: 1,
                },
                _count: {
                    select: {
                        messages: {
                            where: {
                                read: false,
                                senderId: { not: userId }
                            }
                        }
                    }
                }
            },
            orderBy: { updatedAt: "desc" },
        });

        console.log("Chats fetched successfully:");
        console.log(JSON.stringify(chats, null, 2));

    } catch (error) {
        console.error("❌ Error fetching chats:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
