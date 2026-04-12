import nodemailer from "nodemailer";

// ✅ THIS MUST EXIST
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendEmail = async (
    to: string,
    subject: string,
    text: string,
    html?: string
) => {
    await transporter.sendMail({
        from: `"Finance Dashboard" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
        html,
    });
};