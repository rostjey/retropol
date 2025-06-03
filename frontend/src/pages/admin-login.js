"use client";

import { useState } from "react";
import axios from "axios";
//import { useRouter } from "next/router"; // yönlendirme için
import { useRouter } from "next/navigation"; // Next.js 13+ için next/router değil next/navigation kullanın

const AdminLogin = () => {
  const router = useRouter(); // hook'u başlat

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        { 
          email: email.trim(), // trim ekleyin
          password: password.trim() // trim ekleyin
        },
        { withCredentials: true,
          headers: {
            'Content-Type': 'application/json'}
        },
      );
      if (res.data.success) {
        localStorage.setItem('accessToken', res.data.accessToken);
        alert("Admin girişi başarılı!");
        setTimeout(() => router.push("/admin"), 1000);
      } else {
        alert("Email veya şifre yanlış!");
      }
      // 🔁 Admin paneline yönlendir
      //router.push("/admin");
    } catch (error) {
      console.error("Hata detayı:", error.response?.data); // 👈 Detaylı hata
      console.error("🚫 Giriş başarısız:", error);
      alert("Bir hata oluştu.");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded shadow-lg space-y-4 w-full max-w-md">
        <h2 className="text-2xl font-bold">Admin Girişi</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 rounded bg-gray-700 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Şifre"
          className="w-full p-2 rounded bg-gray-700 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full p-2 rounded bg-emerald-600 hover:bg-emerald-500 transition"
        >
          Giriş Yap
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
