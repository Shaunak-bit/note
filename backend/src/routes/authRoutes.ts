import express from "express";
import type { Response, Request, NextFunction } from "express";
import prisma from "../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import middleware from "../middleware/auth";
import crypto from "crypto";
import { sendEmail } from "../lib/sendEmail";

const router = express.Router();
const auth = process.env.JWT_SECRET;

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: (isProduction ? "none" : "lax") as "none" | "lax",
};

router.get("/profile", middleware, async (req: any, res: Response, next: NextFunction) => {
    try {
        console.log("Cookies:", req.cookies);
        const userId = req.user.id;

        const realUser = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })
        if (!realUser) {
            return res.status(404).json({ message: "User not found" })
        }
        return res.status(200).json({ data: realUser })
    }
    catch (error) {
        return res.status(500).json({ message: "Internal server error" })
    }
})

router.patch("/profile", middleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        const { name, email } = req.body

        if (!userId) {
            return res.status(404).json({ message: "User not found" })
        }

        if (!name || !email) {
            return res.status(400).json({ message: "name and email must exists" })
        }

        const findUsers = await prisma.user.findUnique({
            where: {
                id: userId,
            }
        })

        if (!findUsers) {
            return res.status(404).json({ message: "User doesnot exists" })
        }

        const newEmail = await prisma.user.findFirst({
            where: {
                email: email,
                id: {
                    not: userId,
                },
            }
        })

        if (newEmail) {
            return res.status(400).json({ message: "Email already exists" })
        }

        const updateUsers = await prisma.user.update({
            data: {
                name: name,
                email: email
            },
            where: {
                id: userId
            }
        })
        return res.status(200).json({ message: "User updated successfully", data: { id: userId, name: name, email: email } })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" })
    }
})

router.post("/signup", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const existingUser = await prisma.user.findUnique({
            where: { email: email }
        })

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" })
        }

        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password, saltRounds)

        const newUser = await prisma.user.create({
            data: { email: email, name: name, password: hashedPassword }
        })
        const verified = {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name
        };

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET not defined");
        }

        const accessToken = jwt.sign(verified, auth as string, {
            expiresIn: "15m"
        });

        const refreshToken = jwt.sign(verified, auth as string, {
            expiresIn: "7d"
        });

        res.cookie("token", accessToken, {
            ...cookieOptions,
            maxAge: 1000 * 60 * 15
        });

        res.cookie("refreshToken", refreshToken, {
            ...cookieOptions,
            maxAge: 1000 * 60 * 60 * 24 * 7
        });

        await prisma.user.update({
            where: { id: newUser.id },
            data: { refreshToken }
        });

        return res.status(201).json({ message: "User created successfully" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" })
    }
})

router.post("/signin", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const existingUser = await prisma.user.findUnique({ where: { email: email } })

        if (!existingUser) {
            return res.status(401).json({ message: "Invalid Credentials" })
        }

        const comparePassword = await bcrypt.compare(password, existingUser.password)

        if (!comparePassword) {
            return res.status(401).json({ message: "Invalid Credentials" })
        }

        const verified = { id: existingUser.id, email: existingUser.email, name: existingUser.name }

        const accessToken = jwt.sign(verified, auth as string, {
            expiresIn: "15m"
        });

        const refreshToken = jwt.sign(verified, auth as string, {
            expiresIn: "7d"
        });

        res.cookie("token", accessToken, {
            ...cookieOptions,
            maxAge: 1000 * 60 * 15
        });

        res.cookie("refreshToken", refreshToken, {
            ...cookieOptions,
            maxAge: 1000 * 60 * 60 * 24 * 7
        });

        await prisma.user.update({
            where: { id: existingUser.id },
            data: { refreshToken }
        });

        return res.status(200).json({ message: "User logged in successfully" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" })
    }
})

router.post("/refresh-token", async (req: Request, res: Response) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ message: "No refresh token" });
        }

        const decoded = jwt.verify(refreshToken, auth as string) as any;

        const user = await prisma.user.findUnique({
            where: { id: decoded.id }
        });

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        const newAccessToken = jwt.sign(
            { id: user.id, email: user.email, name: user.name },
            auth as string,
            { expiresIn: "15m" }
        );

        res.cookie("token", newAccessToken, {
            ...cookieOptions,
            maxAge: 1000 * 60 * 15
        });

        return res.json({ message: "Token refreshed" });

    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired refresh token" });
    }
});

router.post("/logout", middleware, async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;

        if (userId) {
            await prisma.user.update({
                where: { id: userId },
                data: { refreshToken: null }
            });
        }

        res.clearCookie("token", cookieOptions);
        res.clearCookie("refreshToken", cookieOptions);

        return res.status(200).json({
            message: "User logged out successfully"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

router.post("/reset-password/:token", async (req: Request, res: Response) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!token || !password) {
            return res.status(400).json({ message: "Token and password are required" });
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
            return res.status(400).json({ message: "Invalid or expired token" });
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

        return res.status(200).json({
            message: "Password reset successfully"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

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
                message: "If account exists, reset link sent"
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

        // ✅ Fixed: uses FRONTEND_URL env variable instead of hardcoded localhost
        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        await sendEmail(
            user.email,
            "Reset Password",
            `Reset your password: ${resetLink}`,
            `<a href="${resetLink}">Reset Password</a>`
        );

        return res.status(200).json({
            message: "Reset link sent"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
});

export default router;