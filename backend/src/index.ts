import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import cookieParser from "cookie-parser";
import itemRoutes from "./routes/items";
import settingsRoutes from "./routes/settings.routes";



const app = express();


app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());


app.use("/auth", authRoutes);
app.use("/items", itemRoutes);
app.use("/settings", settingsRoutes);

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});