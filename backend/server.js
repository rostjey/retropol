import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";
import telegramRoutes from "./routes/telegram.route.js";


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

// Üretim ortamı için MUTLAKA ekleyin (Render'da çalışıyorsanız ZORUNLU)
app.set('trust proxy', 1); // Reverse proxy desteği

// CORS ayarları
app.use(cors({
  origin: "https://retropol-ruddy.vercel.app", // Frontend URL
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE","PATCH"] ,// İzin verilen metodlar
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],//bu satırı deepseek ekledi 
  exposedHeaders: ["*", "Authorization","set-cookie"] // Token'ların frontend'de okunması için
}));

// express.json() ayarını güncelleyin
app.use(express.json({
  limit: "10mb",
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  }
}));

app.use(cookieParser());

app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url}`);
  next();
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Origin", req.headers.origin || "https://retropol-ruddy.vercel.app");
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
app.use("/api/telegram", telegramRoutes); // Telegram bot entegrasyonu

// Eğer frontend dosyaları dist içinde ise üretim modunda render edilecektir
// Üretim ortamı kontrolünü güncelleyin
//if (process.env.NODE_ENV === "production") {
  //const frontendPath = path.join(__dirname, "../../frontend/dist"); // Render özel yolu
 // app.use(express.static(frontendPath));
  
  //app.get("*", (req, res) => {
 //   res.sendFile(path.join(frontendPath, "index.html"));
  //});
//}

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  connectDB();
});
