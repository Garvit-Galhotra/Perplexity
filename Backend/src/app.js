import express from "express";
import authRouter from "./routes/auth.routes.js";
import chatRouter from "./routes/chat.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));
app.use(morgan("dev"));

app.use("/api/auth", authRouter);
app.use("/api/chat", chatRouter);

// Serve frontend (Vite build)
app.use(express.static(path.join(__dirname, "dist")));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

export default app;
