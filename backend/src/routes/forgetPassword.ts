import express, { Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";
import { sendEmail } from "../lib/sendEmail";
import crypto from "crypto";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/forgot-password", async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(200).json({
                message: "If an account exists, a reset link has been sent"
            });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");

        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        const expiry = new Date(Date.now() + 15 * 60 * 1000);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetToken: hashedToken,
                resetTokenExpiry: expiry
            }
        });

        const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

        await sendEmail(
            user.email,
            "Reset Password",
            `Reset your password: ${resetLink}`,
            `<a href="${resetLink}">Reset Password</a>`
        );

        return res.json({
            message: "If an account exists, a reset link has been sent"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
router.post("/reset-password/:token", async (req: Request, res: Response) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!token || !password) {
            return res.status(400).json({
                message: "Token and password are required"
            });
        }
        if (typeof token !== 'string') {
            return res.status(400).json({ message: "Invalid token format" });
        }

        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const user = await prisma.user.findFirst({
            where: {
                resetToken: hashedToken,
                resetTokenExpiry: {
                    gt: new Date()
                }
            }
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired token"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null
            }
        });

        return res.json({
            message: "Password reset successful"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});