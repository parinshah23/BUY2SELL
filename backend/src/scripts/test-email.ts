import dotenv from "dotenv";
import { sendEmail } from "../lib/mail";

dotenv.config();

const main = async () => {
    console.log("Sending test email to hiparin2004@gmail.com...");
    try {
        await sendEmail({
            to: "hiparin2004@gmail.com",
            subject: "Test Email from Buy2Sell",
            html: "<h1>Hello Parin!</h1><p>This is a test email from your marketplace app.</p><p>If you see this, the Resend integration is working perfectly! 🚀</p>"
        });
        console.log("✅ Application: Email sent successfully!");
    } catch (error) {
        console.error("❌ Application: Failed to send email.", error);
    }
};

main();
