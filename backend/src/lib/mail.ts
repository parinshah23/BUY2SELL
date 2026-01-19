import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({
    to,
    subject,
    html,
}: {
    to: string;
    subject: string;
    html: string;
}) => {
    if (!process.env.RESEND_API_KEY) {
        console.log("⚠️ RESEND_API_KEY is missing. Email skipped:", { to, subject });
        return;
    }

    try {
        const data = await resend.emails.send({
            from: 'Buy2Sell <onboarding@resend.dev>', // Update this with your verified domain
            to,
            subject,
            html,
        });
        console.log("Email sent:", data);
        return data;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};
