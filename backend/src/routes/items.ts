import express from "express";
import type { Request, Response, NextFunction } from "express";
import middleware from "../middleware/auth";
import prisma from "../lib/prisma";
import { item_status } from "../generated/prisma/client";
import { sendEmail } from "../lib/sendEmail";

const router = express.Router();

interface AuthRequest extends Request {
    user?: {
        id: number;
        email: string;
    };
}

router.post("/", middleware, async (req: Request, res: Response) => {
    try {
        const { title, description, status } = req.body;

        if (!title) {
            return res.status(400).json({ message: "title is required" });
        }

        if (!status || !Object.values(item_status).includes(status)) {
            return res.status(400).json({
                message: `Invalid status. Must be one of: ${Object.values(item_status).join(", ")}`
            });
        }
        const safeDescription =
            description && description.trim() !== "" ? description : undefined;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(400).json({ message: "user id is required" })
        }

        const createdItem = await prisma.item.create({
            data: {
                title: title,
                description: safeDescription,
                status: status as item_status,
                userId: userId
            }
        })

        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        try {
            if (user?.emailNotifications) {
                await sendEmail(
                    user.email,
                    "New Item Created",
                    `You created a new item: ${createdItem.title}`, // fallback

                    // 👇 HTML EMAIL (THIS IS THE MAIN CHANGE)
                    `
        <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:20px;">
          <div style="max-width:500px; margin:auto; background:white; border-radius:10px; padding:20px;">
            
            <h2 style="color:#f97316; text-align:center;">📦 New Item Created</h2>
            
            <p style="font-size:16px; color:#333;">
              Hey ${user.name || "there"} 👋,
            </p>

            <p style="font-size:15px; color:#555;">
              You successfully created a new item:
            </p>

            <div style="background:#fff7ed; padding:12px; border-radius:8px; text-align:center; font-weight:bold;">
              ${createdItem.title}
            </div>

            <a href="http://localhost:3000/dashboard"
               style="display:block; margin:20px auto; width:fit-content;
               background:#f97316; color:white; padding:10px 20px;
               border-radius:6px; text-decoration:none;">
               View Dashboard
            </a>

            <p style="margin-top:20px; font-size:12px; color:#aaa; text-align:center;">
              Finance Dashboard • Notifications
            </p>

          </div>
        </div>
        `
                );
            }
        } catch (err) {
            console.log("Email failed:", err);
        }
        return res.status(201).json({ message: "Item created", data: createdItem });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/", middleware, async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(400).json({ message: "User not found" })
        }

        const items = await prisma.item.findMany({
            where: {
                userId: userId
            },
            orderBy: { createdAt: "desc" }
        })

        return res.status(200).json({ message: "Items fetched successfully", data: items })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
})
router.patch("/:id", middleware, async (req: Request, res: Response, next: NextFunction) => {
    try {

        const itemId = Number(req.params.id);
        const { status } = req.body;
        const userId = req.user?.id;

        if (!status || !Object.values(item_status).includes(status as item_status)) {
            return res.status(400).json({
                message: `Invalid status. Must be one of: ${Object.values(item_status).join(", ")}`
            });
        }

        if (Number.isNaN(itemId)) {
            return res.status(400).json({ message: "itemId is required" })
        }
        if (!userId) {
            return res.status(400).json({ message: "userId is required" })
        }

        const findItem = await prisma.item.findUnique({
            where: {
                id: itemId
            }
        })

        if (!findItem) {
            return res.status(404).json({ message: "item not found" })
        }

        if (findItem.userId !== userId) {
            return res.status(403).json({ message: "you are not authorized to update this item" })
        }

        const updateItem = await prisma.item.update({
            where: {
                id: itemId
            },
            data: {
                status: status as item_status
            }
        })
        return res.status(200).json({
            message: "Item updated successfully",
            data: updateItem
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
})

router.delete("/:id", middleware, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const itemId = Number(req.params.id)
        const userId = req.user?.id

        if (isNaN(itemId)) {
            return res.status(400).json({ message: "Valid item id is required" });
        }

        if (!userId) {
            return res.status(400).json({ message: "user id is required" })
        }

        const existItem = await prisma.item.findUnique({
            where: {
                id: itemId
            }
        });

        if (!existItem) {
            return res.status(404).json({ message: "item not found" })
        }

        if (existItem.userId !== userId) {
            return res.status(403).json({ message: "you are not authorized to delete this item" })
        }

        const deleteItem = await prisma.item.delete({
            where: {
                id: itemId
            }
        })
        return res.status(200).json({ message: "Item deleted successfully", data: deleteItem })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
})
export default router;