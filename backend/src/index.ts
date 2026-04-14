import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import cookieParser from "cookie-parser";
import itemRoutes from "./routes/items";
import settingsRoutes from "./routes/settings.routes";

const app = express();

const allowedOrigins = [
    process.env.FRONTEND_URL || "http://localhost:3000",
    "http://localhost:3000",
];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin) return callback(null, true);

            const isVercelPreview = /^https:\/\/note-ap7f.*\.vercel\.app$/.test(origin);

            if (allowedOrigins.includes(origin) || isVercelPreview) {
                callback(null, true);
            } else {
                callback(new Error(`CORS: Origin ${origin} not allowed`));
            }
        },
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/items", itemRoutes);
app.use("/settings", settingsRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});