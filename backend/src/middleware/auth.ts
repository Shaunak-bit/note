import type { Response, Request, NextFunction } from "express";
import jwt from "jsonwebtoken";

const middleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        const verified = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as { id: number, email: string, name: string };
        req.user = verified
        next()
    }
    catch (error) {
        return res.status(401).json({ message: "unauthorized" })
    }
}

export default middleware;