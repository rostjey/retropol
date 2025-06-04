"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const FeaturedPage = () => {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products/featured`);
        setFeatured(res.data || []);
      } catch (err) {
        console.error("Öne çıkanlar yüklenemedi:", err);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-4xl font-extrabold mb-8 text-center border-b border-emerald-500 pb-4">
        Öne Çıkan Ürünler
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {featured.length > 0 ? (
          featured.map((product) => {
            const image =
              typeof product.image === "string" && product.image.length > 5
                ? product.image
                : "/no-image.png";

            return (
              <div key={product._id || product.name} className="bg-gray-800 p-4 rounded">
                <div className="w-full h-40 mb-3 rounded overflow-hidden bg-gray-700">
                  <img
                    src={image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/no-image.png";
                    }}
                  />
                </div>
                <h3 className="text-xl font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-400">{product.description}</p>
                <p className="text-sm text-gray-300 mt-2">₺{product.price}</p>
                <p className="text-xs text-gray-500 italic">{product.category}</p>
              </div>
            );
          })
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
