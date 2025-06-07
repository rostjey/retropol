"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { FaInstagram } from "react-icons/fa";

const CATEGORY_ORDER = ["nargile", "yemek", "içecek", "tatlı"];

export default function HomePage() {
  const [groupedProducts, setGroupedProducts] = useState({});
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrollVisible, setScrollVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // garson çağırma modalı için state
  const [showCallModal, setShowCallModal] = useState(false);
  const [tableInput, setTableInput] = useState("");


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

  // Garson çağırma fonksiyonu
  const callWaiter = async () => {
    if (!tableInput.trim()) {
      alert("Lütfen masa numarasını girin.");
      return;
    }
  
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/telegram/call-waiter`, {
        tableNumber: tableInput.trim(),
      });
      alert(`✅ Garson çağrıldı! Masa: ${tableInput}`);
      setShowCallModal(false);
      setTableInput("");
    } catch (err) {
      alert("❌ Garson çağrılamadı.");
    }
  };
  
  

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
          withCredentials: true,
        });
        
        const products = res.data.products;
        const grouped = {};

        CATEGORY_ORDER.forEach(category => {
          grouped[category] = products.filter(
            product => product.category?.toLowerCase() === category
          );
        });

        // Diğer kategoriler
        grouped['diğer'] = products.filter(
          product => !CATEGORY_ORDER.includes(product.category?.toLowerCase())
        );

        setGroupedProducts(grouped);
        setError(null);
      } catch (err) {
        console.error("Ürünler alınamadı:", err);
        setError("Ürünler yüklenirken bir hata oluştu. Lütfen tekrar deneyin.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();

    const handleScroll = () => {
      setScrollVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Yükleme durumu
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white p-6 font-sans relative flex items-center justify-center">
        <div className="animate-pulse text-orange-400 text-xl">Menü yükleniyor...</div>
      </div>
    );
  }

  // Hata durumu
  if (error) {
    return (
      <div className="min-h-screen bg-black text-white p-6 font-sans relative flex items-center justify-center">
        <div className="bg-red-900/50 p-8 rounded-xl max-w-md text-center">
          <h2 className="text-2xl font-bold text-orange-400 mb-4">Hata!</h2>
          <p className="mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-orange-400 hover:bg-orange-300 text-white px-4 py-2 rounded-lg font-semibold"
          >
            Yeniden Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url('/retropolmenu.jpg')] text-white p-0 relative">
      {/* Başlık */}
      <h1 className="text-5xl font-extrabold text-orange-400  text-center tracking-tight backdrop-blur-md bg-black/60 p-4 shadow-lg ">
        Menü
      </h1>

      {/* sticky bar kapsayıcı */}
      <div className="sticky top-0 z-10 backdrop-blur-md bg-black/60 border-b border-white/10 flex justify-center items-center p-3">
        {/* Butonlar */}
        <div className="flex flex-wrap justify-center gap-3 items-center">
          <Link href="/featured">
            <button className="bg-orange-400 hover:bg-orange-300 text-white px-4 py-1.5 rounded-lg font-semibold shadow transition">
              Öne Çıkanlar
            </button>
          </Link>

          {/* Kategoriler Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-1.5 rounded-lg font-semibold shadow transition"
            >
              Kategoriler
            </button>
            {showDropdown && (
              <div className="absolute top-full left-0 mt-2 bg-gray-800 border border-gray-600 rounded shadow z-10 w-40">
                {CATEGORY_ORDER.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => scrollToCategory(cat)}
                    className="w-full text-left px-4 py-1.5 hover:bg-gray-700 capitalize"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Sosyal Medya Linkleri */}
          <a
            href="https://www.instagram.com/retropolatakum/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white px-1.5 py-1.5 rounded-lg font-semibold shadow transition hover:opacity-90"
          >
            <FaInstagram size={20} />
            <span className="hidden sm:inline">Instagram</span>
          </a>
        </div>
      </div>

      {/* Ürün Kartları */}
      {CATEGORY_ORDER.map((category) => {
        const items = groupedProducts[category];
        if (!items || items.length === 0) return null;

        return (
          <div key={category} ref={refs[category]} className="mb-14">
            <h2 className="text-3xl font-bold text-orange-400 mb-4 border-l-4 border-orange-400 pl-3 capitalize">
              {category}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((product) => (
                <div
                  key={product._id}
                  className="bg-white/10 backdrop-blur-md border border-white/10 hover:shadow-orange-400/30 bg-gray-800 rounded-xl overflow-hidden shadow-lg shadow-orange-500/10 animate-pulseShadow transition-all duration-1000 ease-in-out"
                >
                  <img
                    src={product.image || "/no-image.png"}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                  />
                  <div className="p-4 space-y-2">
                    <h3 className="text-xl font-bold">{product.name}</h3>
                    <p className="text-gray-400 text-sm">{product.description}</p>
                    <p className="text-emerald-500 text-lg font-semibold">₺{product.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Diğer kategoriler 
      {groupedProducts['diğer']?.length > 0 && (
        <div ref={refs['diğer']} className="mb-14">
          <h2 className="text-3xl font-bold text-orange-400 mb-4 border-l-4 border-orange-400 pl-3">
            Diğer Ürünler
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupedProducts['diğer'].map((product) => (
              <div
                key={product._id}
                className="bg-white/10 backdrop-blur-md border border-white/10 hover:shadow-orange-400/30 bg-gray-800 rounded-xl overflow-hidden shadow-lg shadow-orange-500/10 animate-pulseShadow transition-all duration-1000 ease-in-out"
              >
                <img
                  src={product.image || "/no-image.png"}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                <div className="p-4 space-y-2">
                  <h3 className="text-xl font-bold">{product.name}</h3>
                  <p className="text-gray-400 text-sm">{product.description}</p>
                  <p className="text-emerald-500 text-lg font-semibold">₺{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      */}

      {/* Garsonu Çağır Butonu */}
      <div className="fixed bottom-6 left-4 z-50">
        <button
          onClick={() => setShowCallModal(true)}
          className="bg-orange-400 hover:bg-orange-300 text-white px-4 py-2 rounded-full shadow-lg transition "
        >
          Garsonu Çağır
        </button>
      </div>

      {/* Scroll to Top Button */}
      {scrollVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-orange-400 hover:bg-orange-300 text-white px-4 py-2 rounded-full shadow-lg transition"
        >
          ↑ Yukarı Çık
        </button>
      )}

      {/* Garson Çağırma Modal */}
      {showCallModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
              <div className="bg-gray-800 rounded-xl p-6 w-80 text-center space-y-4">
                <h2 className="text-xl font-bold text-orange-400">Masa Numaranız</h2>
                <input
                type="text"
                value={tableInput}
                onChange={(e) => setTableInput(e.target.value)}
                placeholder="Örn: 3"
                className="w-full px-4 py-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
             />
            <div className="flex justify-between gap-4 pt-2">
              <button
                onClick={() => setShowCallModal(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded"
              >
                 İptal
              </button>
              <button
                onClick={callWaiter}
                className="flex-1 bg-orange-500 hover:bg-orange-400 text-white px-4 py-2 rounded"
              >
                Çağır
              </button>
            </div>
          </div>
        </div>
       )};
  </div>
  );
};