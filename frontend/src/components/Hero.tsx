"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { AuroraBackground } from "@/components/ui/aurora-background";

import { TypewriterEffect } from "@/components/ui/typewriter-effect";

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const words = [
    { text: "Discover" },
    { text: "Unique" },
    { text: "Digital", className: "text-primary-600" },
    { text: "Assets", className: "text-rose-500" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <AuroraBackground className="h-[500px] md:h-[600px] overflow-hidden">
      <div className="relative z-10 container-custom h-full flex flex-col items-center justify-center text-center px-4 pt-36">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-sm font-medium mb-6 animate-fade-in-up">
            <span className="text-base">🚀</span> The #1 Marketplace for Creators
          </div>

          <div className="mb-6 flex justify-center">
            <TypewriterEffect words={words} className="text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow-sm leading-tight text-secondary-900" cursorClassName="bg-primary-500" />
          </div>
          <p className="text-xl md:text-2xl text-secondary-600 mb-10 font-medium max-w-2xl mx-auto">
            Buy and sell high-quality products in a secure and professional environment.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto w-full group mb-12">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-secondary-400 group-focus-within:text-primary-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search for items, brands, or members..."
              className="w-full pl-14 pr-36 py-4 rounded-full text-lg bg-white/80 backdrop-blur-md text-secondary-900 placeholder-secondary-400 focus:outline-none focus:ring-4 focus:ring-primary-500/20 shadow-xl border border-secondary-200 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-2 top-2 bottom-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 rounded-full transition-all shadow-md active:scale-95"
            >
              Search
            </button>
          </form>

          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 text-sm font-medium text-secondary-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              Verified Sellers
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              Secure Payments
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              Instant Delivery
            </div>
          </div>
        </motion.div>
      </div>

      {/* Sell Now Floating CTA - Bottom Right usually, but letting it be part of flow or navbar */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-secondary-50 to-transparent pointer-events-none" />
    </AuroraBackground>
  );
}
