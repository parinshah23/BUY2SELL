import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {
    const email = "hiparin2004@gmail.com";
    console.log(`Creating test notification for ${email}...`);

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        console.error("User not found!");
        return;
    }

    await prisma.notification.create({
        data: {
            userId: user.id,
            title: "Test Notification 🔔",
            message: "This is a test notification to verify the In-App system works.",
            type: "SYSTEM",
            link: "/"
        }
    });

    console.log("✅ Notification created successfully!");
};

main();
