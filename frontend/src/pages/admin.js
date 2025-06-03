import { useEffect, useState } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import { Trash, LogOut, Edit } from "lucide-react";
import { useRouter } from "next/router";
import CreateProductForm from "../components/CreateProductForm.jsx";

const EditProductForm = dynamic(() => import("../components/EditProductForm"), {
  ssr: false,
});

const AdminPage = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Axios instance with credentials
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Add request interceptor
  api.interceptors.request.use(config => {
    console.log('Sending request to:', config.url);
    return config;
  });

  // Add response interceptor
  api.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        alert('Oturum sona erdi. Lütfen tekrar giriş yapın.');
        router.push('/admin-login');
      }
      return Promise.reject(error);
    }
  );

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/products");
      setProducts(res.data.products);
    } catch (err) {
      console.error("Ürünler çekilemedi:", err);
      alert(err.response?.data?.message || "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;
    
    try {
      await api.delete(`/products/${id}`);
      alert("Ürün silindi!");
      fetchProducts();
    } catch (err) {
      console.error("Silme hatası:", err);
      alert(err.response?.data?.message || "Silme işlemi başarısız");
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      alert("Çıkış yapıldı!");
      router.push("/admin-login");
    } catch (err) {
      console.error("Çıkış hatası:", err);
    }
  };

  const toggleFeatured = async (id) => {
    try {
      await api.patch(`/products/${id}`, { 
        isFeatured: !products.find(p => p._id === id)?.isFeatured 
      });
      fetchProducts();
    } catch (err) {
      console.error("Öne çıkarma hatası:", err);
      alert(err.response?.data?.message || "İşlem başarısız");
    }
  };

  useEffect(() => {
    // Initial auth check
    const checkAuth = async () => {
      try {
        await api.get("/auth/profile");
      } catch (err) {
        router.push("/admin-login");
      }
    };
    checkAuth();
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">Admin Panel</h1>
          <button
            onClick={handleLogout}
            className="flex items-center text-red-500 hover:text-red-400"
          >
            <LogOut className="w-5 h-5 mr-1" />
            Çıkış Yap
          </button>
        </div>

        {loading ? (
          <div className="text-center py-10">Yükleniyor...</div>
        ) : (
          <>
            <div className="space-y-4 mb-10">
              {products.map((product) => (
                <div key={product._id} className="bg-gray-800 p-4 rounded-lg flex flex-col md:flex-row gap-4">
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full md:w-24 h-24 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold">{product.name}</h2>
                    <p className="text-gray-400">₺{product.price}</p>
                    <p className="text-sm text-gray-500">{product.category}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-end">
                    <button
                      onClick={() => setEditingProduct(product)}
                      className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-500 flex items-center"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Düzenle
                    </button>
                    <button
                      onClick={() => toggleFeatured(product._id)}
                      className={`px-3 py-1 rounded flex items-center ${
                        product.isFeatured ? "bg-yellow-600" : "bg-gray-600"
                      } hover:opacity-80`}
                    >
                      {product.isFeatured ? "❌ Kaldır" : "⭐ Öne Çıkar"}
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="bg-red-600 px-3 py-1 rounded hover:bg-red-500 flex items-center"
                    >
                      <Trash className="w-4 h-4 mr-1" />
                      Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <CreateProductForm onCreated={fetchProducts} />

            {editingProduct && (
              <EditProductForm
                product={editingProduct}
                onClose={() => setEditingProduct(null)}
                onSave={() => {
                  fetchProducts();
                  setEditingProduct(null);
                }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPage;