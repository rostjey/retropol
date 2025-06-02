import express from "express";
import {
  signup,
  login,
  logout,
  refreshToken,
  getProfile,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);          // Admin kullanıcı ekleme
router.post("/login", login);            // Giriş
router.post("/logout", logout);          // Çıkış
router.post("/refresh-token", refreshToken); // Token yenileme
router.get("/profile", protectRoute, getProfile); // Kullanıcı profili

export default router;
// Bu dosya, kullanıcı kimlik doğrulama işlemleri için gerekli rotaları tanımlar.