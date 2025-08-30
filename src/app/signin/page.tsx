"use client";

import Image from "next/image";
import authSvg from "../../../public/auth.svg";

export default function Signin() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-10 items-center px-6">
        {/* Chap qism - Form */}
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-6 text-center">
          <h2 className="text-4xl font-bold text-[#252525]">Kirish</h2>
          <p className="text-lg text-[#4B4B4B] mb-5">
            Telefon raqam va parolingizni kiriting.
          </p>

          <form className="space-y-4 text-left">
            {/* Telefon */}
            <div>
              <input
                type="tel"
                placeholder="Telefon raqam (998901234567)"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Parol */}
            <div>
              <input
                type="password"
                placeholder="Parol"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Button */}
            <button
              type="button"
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
