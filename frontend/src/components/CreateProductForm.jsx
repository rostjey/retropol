"use client";

import { useState } from "react";
import axios from "axios";

const CreateProductForm = ({ onCreated }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setForm({ ...form, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/products`,
        form,
        { withCredentials: true }
      );
      alert("Ürün başarıyla eklendi!");
      setForm({ name: "", description: "", price: "", category: "", image: "" });
      if (onCreated) onCreated(); // listeyi güncelle
    } catch (err) {
      console.error("Ürün ekleme hatası:", err);
      alert("Bir hata oluştu.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
      <h2 className="text-xl font-bold text-white">Yeni Ürün Ekle</h2>
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Ürün adı"
        className="w-full p-2 bg-gray-700 rounded text-white"
        required
      />
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Açıklama"
        className="w-full p-2 bg-gray-700 rounded text-white"
        required
      />
      <input
        name="price"
        type="number"
        step="0.01"
        value={form.price}
        onChange={handleChange}
        placeholder="Fiyat"
        className="w-full p-2 bg-gray-700 rounded text-white"
        required
      />
      <input
        name="category"
        value={form.category}
        onChange={handleChange}
        placeholder="Kategori"
        className="w-full p-2 bg-gray-700 rounded text-white"
        required
      />
      <div className="flex flex-col">
      <label htmlFor="imageUpload" className="text-sm mb-1">Ürün Görseli</label>
       <input
         id="imageUpload"
         type="file"
         accept="image/*"
         onChange={handleImageChange}
         className="block w-full text-sm text-gray-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded file:border-0
                    file:text-sm file:font-semibold
                    file:bg-emerald-600 file:text-white
                    hover:file:bg-emerald-500"
        />
      </div>

      <button type="submit" className="w-full bg-emerald-600 p-2 rounded text-white hover:bg-emerald-500">
        Ürünü Ekle
      </button>
    </form>
  );
};

export default CreateProductForm;
