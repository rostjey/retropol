"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Link from "next/link";

const CATEGORY_ORDER = ["nargile", "yemek", "içecek", "tatlı"];

export default function HomePage() {
  const [groupedProducts, setGroupedProducts] = useState({});

  // Ref'ler her kategori için
  const refs = {
    nargile: useRef(null),
    yemek: useRef(null),
    içecek: useRef(null),
    tatlı: useRef(null),
  };

  const scrollToCategory = (category) => {
    refs[category]?.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`);
        const products = res.data.products;

        const grouped = {};
        products.forEach((product) => {
          const category = product.category?.toLowerCase() || "diğer";
          if (!grouped[category]) grouped[category] = [];
          grouped[category].push(product);
        });

        setGroupedProducts(grouped);
      } catch (err) {
        console.error("Ürünler alınamadı:", err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">Menü</h1>

      {/* Butonlar */}
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        <Link href="/featured">
          <button className="bg-emerald-600 px-4 py-2 rounded hover:bg-emerald-500">
            ⭐ Öne Çıkanlar
          </button>
        </Link>
        {/*<Link href="/recommendations">
          <button className="bg-emerald-600 px-4 py-2 rounded hover:bg-emerald-500">
            🤖 Önerilenler
          </button>
        </Link>*/}

        {/* Scroll butonları */}
        {CATEGORY_ORDER.map((cat) => (
          <button
            key={cat}
            onClick={() => scrollToCategory(cat)}
            className="bg-emerald-600 px-4 py-2 rounded hover:bg-emerald-500"
          >
            📂 {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Ürünler */}
      {CATEGORY_ORDER.map((category) => {
        const items = groupedProducts[category];
        if (!items) return null;

        return (
          <div key={category} ref={refs[category]} className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 capitalize">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((product) => (
                <div key={product._id} className="bg-gray-800 p-4 rounded shadow-lg">
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded mb-3"
                    />
                  )}
                  <h3 className="text-xl font-bold">{product.name}</h3>
                  <p className="text-sm text-gray-400 mb-2">{product.description}</p>
                  <p className="text-emerald-400 text-lg font-semibold">₺{product.price}</p>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
