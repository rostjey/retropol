import express from "express";
import {
  addToCart,
  getCartProducts,
  removeAllFromCart,
  updateQuantity,
} from "../controllers/cart.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Sepeti görüntüle
router.get("/", protectRoute, getCartProducts);

// Sepete ürün ekle
router.post("/", protectRoute, addToCart);

// Sepetten ürün(leri) sil
router.delete("/", protectRoute, removeAllFromCart);

// Ürün miktarını güncelle
router.put("/:id", protectRoute, updateQuantity);

export default router;
// Bu dosya, sepet işlemleri için gerekli rotaları tanımlar.