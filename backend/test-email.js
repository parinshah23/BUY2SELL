const { Resend } = require('resend');
require('dotenv').config();

const main = async () => {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
        console.error("❌ RESEND_API_KEY is missing from .env");
        return;
    }

    const resend = new Resend(apiKey);

    console.log("Sending test email to hiparin2004@gmail.com...");
    try {
        const data = await resend.emails.send({
            from: 'Buy2Sell <onboarding@resend.dev>',
            to: 'hiparin2004@gmail.com',
            subject: 'Test Email from Buy2Sell (Direct JS)',
            html: '<h1>Hello Parin!</h1><p>This is a direct test from a JS script.</p><p>If you see this, your API Key is valid! 🚀</p>'
        });
        console.log("✅ Application: Email sent successfully!", data);
    } catch (error) {
        console.error("❌ Application: Failed to send email.", error);
    }
};

main();
