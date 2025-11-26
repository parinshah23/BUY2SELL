import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import router from "./routes/index";
import productRouter from "./routes/products";
import authRouter from "./routes/auth";
import uploadRouter from "./routes/upload";
import chatRouter from "./routes/chat";
import userRouter from "./routes/user";
import adminRouter from "./routes/admin";
import reviewRouter from "./routes/reviews";
import orderRouter from "./routes/orders";
import statsRouter from "./routes/stats";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet({ crossOriginResourcePolicy: false })); // Allow loading images from cross-origin
app.use(morgan("dev"));

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/v1", router);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/upload", uploadRouter);
app.use("/api/v1/chats", chatRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1", reviewRouter);
app.use("/api/v1", orderRouter);
app.use("/api/v1/stats", statsRouter);

export default app;
