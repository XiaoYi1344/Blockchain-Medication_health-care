// src/components/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const navItems = [
  { id: "home", label: "Trang chủ" },
  { id: "features", label: "Tính năng" },
  { id: "process", label: "Quy trình" },
  { id: "about", label: "Về chúng tôi" },
  { id: "contact", label: "Liên hệ" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    let mounted = true;

    const handleScroll = () => {
      if (mounted) setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      mounted = false;
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "backdrop-blur-md bg-white/70 shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image
            src="/logo-icon.png"
            alt="Logo"
            width={32}
            height={32}
            className="rounded-md"
          />
          <span className="text-xl font-extrabold text-blue-700">MedChain</span>
        </div>

        {/* Menu */}
        <ul className="hidden md:flex gap-8">
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <a
            href="#register"
            className="hidden md:inline-block px-4 py-2 rounded-full border border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition"
          >
            Đăng ký
          </a>
          <a
            href="#explore"
            className="px-5 py-2 rounded-full font-semibold text-white bg-gradient-to-r from-blue-600 via-blue-500 to-green-500 hover:opacity-90 transition shadow-md"
          >
            Khám phá ngay
          </a>
        </div>
      </div>
    </nav>
  );
}
