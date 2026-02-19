import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
// import artifactRoutes from "./routes/artifacts.route.js";
// import chatRoutes from "./src/chat.route.js";
// import webhookRoutes from "./src/webhook/webhook.js";

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(morgan("dev"));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CMS Backend is running",
  });
});

app.use("/auth", authRoutes);
// app.use("/artifacts", artifactRoutes);
// app.use("/webhook", webhookRoutes);
// app.use("/chat", chatRoutes);

export default app;