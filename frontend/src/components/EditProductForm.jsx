"use client";

import { useState } from "react";
import axios from "axios";

const EditProductForm = ({ product, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${product._id}`,
        formData,
        {
          withCredentials: true,
        }
      );
      onSave(); // Listeyi güncelle
      onClose(); // Modalı kapat
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
      }}
    >
      <div
        style={{
          backgroundColor: "#1f2937",
          padding: "20px",
          borderRadius: "8px",
          color: "#fff",
          width: "90%",
          maxWidth: "400px",
        }}
      >
        <h2 style={{ fontSize: "18px", marginBottom: "10px" }}>Ürünü Düzenle</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ürün Adı"
            required
            className="w-full p-2 rounded bg-gray-700 text-white mb-2"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Açıklama"
            required
            className="w-full p-2 rounded bg-gray-700 text-white mb-2"
            rows={3}
          />
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Fiyat"
            step="0.01"
            required
            className="w-full p-2 rounded bg-gray-700 text-white mb-2"
          />
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Kategori"
            required
            className="w-full p-2 rounded bg-gray-700 text-white mb-2"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductForm;
