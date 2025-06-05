"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Link from "next/link";

const CATEGORY_ORDER = ["nargile", "yemek", "içecek", "tatlı"];

export default function HomePage() {
  const [groupedProducts, setGroupedProducts] = useState({});
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrollVisible, setScrollVisible] = useState(false);

  const refs = {
    nargile: useRef(null),
    yemek: useRef(null),
    içecek: useRef(null),
    tatlı: useRef(null),
  };

  const scrollToCategory = (category) => {
    refs[category]?.current?.scrollIntoView({ behavior: "smooth" });
    setShowDropdown(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
          withCredentials: true,
        });
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

    const handleScroll = () => {
      setScrollVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans relative">
      {/* Başlık */}
      <h1 className="text-5xl font-extrabold text-emerald-400 mb-10 text-center tracking-tight">
        Menü
      </h1>

      {/* Butonlar */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        <Link href="/featured">
          <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-lg font-semibold shadow transition">
            Öne Çıkanlar
          </button>
        </Link>

        {/* Kategoriler Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="bg-gray-700 hover:bg-gray-600 text-white px-5 py-2 rounded-lg font-semibold shadow transition"
          >
            Kategoriler
          </button>
          {showDropdown && (
            <div className="absolute top-full left-0 mt-2 bg-gray-800 border border-gray-600 rounded shadow z-10 w-40">
              {CATEGORY_ORDER.map((cat) => (
                <button
                  key={cat}
                  onClick={() => scrollToCategory(cat)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-700 capitalize"
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Ürün Kartları */}
      {CATEGORY_ORDER.map((category) => {
        const items = groupedProducts[category];
        if (!items) return null;

        return (
          <div key={category} ref={refs[category]} className="mb-14">
            <h2 className="text-3xl font-bold text-emerald-300 mb-4 border-l-4 border-emerald-500 pl-3 capitalize">
              {category}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((product) => (
                <div
                  key={product._id}
                  className="bg-gray-800 rounded-xl overflow-hidden shadow-lg 
                  transition-all duration-1000 ease-in-out 
                  hover:shadow-orange-500/50 
                  shadow-orange-500/10 animate-[pulseShadow_2s_ease-in-out_infinite]"
                >
                  <img
                    src={product.image || "/no-image.png"}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4 space-y-2">
                    <h3 className="text-xl font-bold">{product.name}</h3>
                    <p className="text-gray-400 text-sm">{product.description}</p>
                    <p className="text-orange-400 text-lg font-semibold">₺{product.price}</p>
                    </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Scroll to Top Button */}
      {scrollVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-full shadow-lg transition"
        >
          ↑ Yukarı Çık
        </button>
      )}
    </div>
  );
}
