import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";
import Product from "../models/product.model.js";

// Admin - Tüm ürünleri getir
export const getAllProducts = async (req, res) => {
  try {
    console.log("💡 getAllProducts çağrıldı"); // 👈 Bunu ekle
    const products = await Product.find({});
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Kullanıcı - Öne çıkan ürünleri getir
export const getFeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = await redis.get("featured_products");
    if (featuredProducts) {
      console.log("🎯 Redis'ten çekilen veri:", JSON.parse(featuredProducts).length, "ürün");
      return res.json(JSON.parse(featuredProducts));
    }

    featuredProducts = await Product.find({ isFeatured: true }).lean();

    if (!featuredProducts) {
      return res.status(404).json({ message: "No featured products found" });
    }

    await redis.set("featured_products", JSON.stringify(featuredProducts));
    res.json(featuredProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin - Yeni ürün oluştur
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, image } = req.body;

    let imageUrl = "";

    if (image) {
      const uploaded = await cloudinary.uploader.upload(image, {
        folder: "menu-products",
      });
      imageUrl = uploaded.secure_url;
    }

    const product = new Product({
      name,
      description,
      price,
      category,
      image: imageUrl,
    });

    await product.save();
    res.status(201).json({ message: "Ürün başarıyla oluşturuldu", product });
  } catch (error) {
    console.error("❌ Ürün ekleme hatası:", error.message);
    res.status(500).json({ message: "Sunucu hatası", error: error.message });
  }
};

// Admin - Ürün sil
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.image) {
      const publicId = product.image.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
      } catch (error) {
        console.log("Cloudinary silme hatası", error);
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Kullanıcı - Kategoriye göre ürünler
export const getProductsByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const products = await Product.find({ category });
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Kullanıcı - Rastgele önerilen ürünler
/* export const getRecommendedProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      { $sample: { size: 4 } },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          image: 1,
          price: 1,
        },
      },
    ]);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
*/


// Admin - Öne çıkarma durumu değiştir
export const toggleFeaturedProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.isFeatured = !product.isFeatured;
      const updatedProduct = await product.save();
      await updateFeaturedProductsCache();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};           


async function updateFeaturedProductsCache() {
  try {
    const featuredProducts = await Product.find({ isFeatured: true }).lean();
    console.log("✅ Cache güncelleniyor, ürün sayısı:", featuredProducts.length); // 👉 bunu ekle
    await redis.set("featured_products", JSON.stringify(featuredProducts));
  } catch (error) {
    console.log("Öne çıkan ürünler cache güncelleme hatası");
  }
}

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const { name, description, price, category, image } = req.body;

    // Alanları isteğe göre güncelle
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (category !== undefined) product.category = category;
    if (image !== undefined) product.image = image;

    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};