import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";


import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";

import { connectDB } from "./lib/db.js";

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5050;

app.use(express.json({ limit: "10mb" }));

app.use(cors({
  origin: "https://retropol-ruddy.vercel.app", // Frontend URL
  credentials: true,
}));

app.use(cookieParser());

app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url}`);
  next();
});
//buraya dikkat silebiliriz 
app.use((req, res, next) => {
  console.log("💡 [REQUEST]", req.method, req.path);
  if (req.is('application/json')) {
    console.log("📦 Body:", req.body);
  }
  next();
});
// gelen her istek loglanacak

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
// app.use("/api/analytics", analyticsRoutes); // grafik kısmı eklenecekse açarız

// Eğer frontend dosyaları dist içinde ise üretim modunda render edilecek
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  connectDB();
});
