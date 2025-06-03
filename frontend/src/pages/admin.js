import { useEffect, useState } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import CreateProductForm from "../components/CreateProductForm.jsx";
import { Trash } from "lucide-react";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

const EditProductForm = dynamic(() => import("../components/EditProductForm"), {
  ssr: false,
});

import { Edit } from "lucide-react";

const AdminPage = () => {
	const [products, setProducts] = useState([]);
	const [editingProduct, setEditingProduct] = useState(null);

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
	const router = useRouter();	

	const fetchProducts = async () => {
		try {
			const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
				withCredentials: true,
			});
			setProducts(res.data.products);
		} catch (err) {
			console.error("Error fetching products", err);
		}
	};

	useEffect(() => {
		fetchProducts();
	}, []);

	const handleDelete = async (id) => {
		if (!confirm("Bu ürünü silmek istediğine emin misin?")) return;
	  
		try {
		  await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
			withCredentials: true,
		  });
		  alert("Ürün silindi!");
		  fetchProducts(); // ürünleri yeniden çek
		} catch (err) {
		  console.error("Silme hatası:", err);
		  alert("Bir hata oluştu.");
		}
	};

	const handleLogout = async () => {
		try {
		  await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {}, { withCredentials: true });
		  alert("Çıkış yapıldı!");
		  window.location.href = "/admin-login";
		} catch (err) {
		  console.error("Çıkış hatası:", err);
		  alert("Çıkış yapılamadı!");
		}
	};

	const toggleFeatured = async (id) => {
		try {
		  await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {}, {
			withCredentials: true,
		  });
		  await fetchProducts(); // Güncelleme sonrası yeniden çek
		  //router.push("/featured"); // işlem bittikten sonra yönlendir
		} catch (err) {
		  console.error("Öne çıkarma hatası:", err);
		  alert("Bir hata oluştu.");
		}
	};

	//const router = useRouter(); //öne çıkanları tekrar görmek istiyorsanız bu satırı ekleyin
	  
	  

	return (
		<div className="min-h-screen bg-black text-white p-10">
			<h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
			<div className="flex justify-between items-center mb-6">
            <button
                onClick={handleLogout}
                className="flex items-center text-red-500 hover:text-red-400"
            >
                <LogOut className="w-5 h-5 mr-1" />
                Çıkış Yap
            </button>
        </div>

			<div className="space-y-4">
			{products.map((product) => (
        <div key={product._id} className="bg-gray-800 p-4 rounded flex justify-between items-center gap-4">
          {product.image && (
            <img
              src={product.image}
              alt={product.name}
              className="w-24 h-24 object-cover rounded"
            />
          )}
          <div className="flex-1">
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p className="text-sm text-gray-400">₺{product.price}</p>
            <p className="text-sm text-gray-500">{product.category}</p>
          </div>
          <button
            onClick={() => setEditingProduct(product)}
            className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-500"
          >
            <Edit className="w-4 h-4 inline-block mr-1" />
            Edit
          </button>
		  
              <button
                 onClick={() => toggleFeatured(product._id)}
                 className={`px-3 py-1 rounded ${
                 product.isFeatured ? "bg-yellow-600" : "bg-gray-600"
                } hover:opacity-80`}
              >
              {product.isFeatured ? "❌ Kaldır" : "⭐ Öne Çıkar"}
              </button>
            



		  <button
           onClick={() => handleDelete(product._id)}
           className="bg-red-600 px-3 py-1 rounded hover:bg-red-500 ml-2"
         >
           <Trash className="w-4 h-4 inline-block mr-1" />
             Sil
          </button>

       </div>
))}

			</div>
			<div className="mt-10">
             <CreateProductForm onCreated={fetchProducts} />
            </div>

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
		</div>
	);
};

export default AdminPage;
