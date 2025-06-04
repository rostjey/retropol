"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const FeaturedPage = () => {
  const [featured, setFeatured] = useState([]);
  const validImage = product.image && product.image.length > 5 ? product.image : "/no-image.png";


  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products/featured`);
        setFeatured(res.data);
      } catch (err) {
        console.error("Öne çıkanlar yüklenemedi:", err);
      }
    };
    

    fetchFeatured();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* Başlık */}
      <h1 className="text-4xl font-extrabold mb-8 text-center border-b border-emerald-500 pb-4">
        ⭐ Öne Çıkan Ürünler
      </h1>

      {/* Ürünler */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Array.isArray(featured) && featured.length > 0 ? (
          featured.map((product) => (
            <div key={product._id} className="bg-gray-800 p-4 rounded">
              {product.image ? (
      <img
          src={product.image}
          alt={product.name}
          onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = "/no-image.png";
        }}
        className="w-full h-40 object-cover rounded mb-3"
       />
        ) : (
        <div className="w-full h-40 bg-gray-700 rounded mb-3 flex items-center justify-center text-gray-400 text-sm">
        Görsel yok
        </div>
        )}

              <h3 className="text-xl font-semibold">{product.name}</h3>
              <p className="text-sm text-gray-400">{product.description}</p>
              <p className="text-sm text-gray-300 mt-2">₺{product.price}</p>
              <p className="text-xs text-gray-500 italic">{product.category}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center col-span-full">
            Henüz öne çıkan ürün yok.
          </p>
        )}
      </div>
    </div>
  );
};

export default FeaturedPage;
