import express from "express";
import { Request, Response } from "express";
import middleware from "../middleware/auth";
import prisma from "../lib/prisma";

const router = express.Router();

router.get("/", middleware, async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const userId = req.user.id;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" })
        }

        const findUser = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                emailNotifications: true,
                pushNotifications: true,
                weeklyDigest: true,
            }
        })

        if (!findUser) {
            return res.status(404).json({ message: "User not found" })
        }

        return res.status(200).json({ message: "Userfound", user: { emailNotifications: findUser.emailNotifications, pushNotifications: findUser.pushNotifications, weeklyDigest: findUser.weeklyDigest } })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
})

router.patch("/", middleware, async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "unathorized" })
        }

        const userId = req.user.id;

        const { emailNotifications, pushNotifications, weeklyDigest } = req.body;

        if (emailNotifications !== undefined && typeof emailNotifications !== "boolean") {
            return res.status(400).json({ message: "Invalid emailNotifications" })
        }

        if (pushNotifications !== undefined && typeof pushNotifications !== "boolean") {
            return res.status(400).json({ message: "Invalid pushNotifications" })
        }

        if (weeklyDigest !== undefined && typeof weeklyDigest !== "boolean") {
            return res.status(400).json({ message: "Invalid weeklyDigest" })
        }

        const updateData: any = {}

        if (emailNotifications !== undefined) {
            updateData.emailNotifications = emailNotifications;
        }

        if (pushNotifications !== undefined) {
            updateData.pushNotifications = pushNotifications;
        }

        if (weeklyDigest !== undefined) {
            updateData.weeklyDigest = weeklyDigest;
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "No update data provided" })
        }

        const updateSettings = await prisma.user.update({
            where: {
                id: userId,
            },
            data: updateData,
            select: {
                emailNotifications: true,
                pushNotifications: true,
                weeklyDigest: true,
            }
        })

        return res.status(200).json({ message: "Settings updated successfully", user: updateSettings })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
})
export default router;