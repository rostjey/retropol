import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getFeaturedProducts,
  getProductsByCategory,
  toggleFeaturedProduct,
  updateProduct,
} from "../controllers/product.controller.js";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Admin panelden ürünleri yönetmek için
router.post("/", protectRoute, adminRoute,createProduct);  
router.put("/:id", protectRoute, adminRoute, updateProduct); // fiyat güncelleme gibi işlemler için
router.delete("/:id", protectRoute, adminRoute, deleteProduct);
router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct);

// Kullanıcı tarafı için
router.get("/",getAllProducts); 
router.get("/featured", getFeaturedProducts);
router.get("/category/:category", getProductsByCategory);

export default router;
// Bu dosya, ürünlerle ilgili rotaları tanımlar. Admin paneli ve kullanıcı tarafı için farklı işlemler içerir.
// Admin paneli için ürün ekleme, silme ve listeleme işlemleri,