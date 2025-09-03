"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert } from "antd";
import authSvg from "../../../public/auth.svg";

export default function Signin() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("https://unco-backend.onrender.com/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, password }),
      });

      if (!res.ok) {
        throw new Error("Telefon raqam yoki parol noto‘g‘ri!");
      }

      const data = await res.json();

      // ✅ LocalStorage ga yozish
      localStorage.setItem("user", JSON.stringify(data));

      setSuccess(true);

      // ✅ 2 soniyadan keyin Home sahifasiga o'tish
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Kirishda xatolik yuz berdi!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-10 items-center px-6">
        {/* Chap qism - Form */}
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-6 text-center">
          <h2 className="text-4xl font-bold text-[#252525]">Kirish</h2>
          <p className="text-lg text-[#4B4B4B] mb-5">Telefon raqam va parolingizni kiriting.</p>

          {/* ✅ Alert */}
          {success && (
            <Alert
              message="Muvaffaqiyatli kirdingiz 🎉"
              type="success"
              showIcon
              closable
              className="mb-4 text-left"
            />
          )}
          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              closable
              className="mb-4 text-left"
            />
          )}

          <form className="space-y-4 text-left" onSubmit={handleSignin}>
            {/* Telefon */}
            <div>
              <input
                type="tel"
                placeholder="Telefon raqam (998901234567)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>

            {/* Parol */}
            <div>
              <input
                type="password"
                placeholder="Parol"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full py-2 bg-indigo-500 hover:bg-white hover:text-indigo-500 border border-indigo-500 text-white font-semibold rounded-lg transition duration-200"
            >
              Kirish
            </button>
          </form>
        </div>

        {/* O‘ng qism - Rasm */}
        <div className="hidden md:flex justify-center">
          <Image src={authSvg} alt="Avtorizatsiya rasmi" className="max-w-md w-full" />
        </div>
      </div>
    </div>
  );
}
