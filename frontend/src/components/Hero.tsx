"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

import { ImagesSlider } from "@/components/ui/images-slider";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";

// Assets
import img2 from "@/assets/christopher-gower-_aXa21cf7rY-unsplash.jpg";
import img3 from "@/assets/foad-roshan-WlSdc3JumNU-unsplash.jpg";
import img4 from "@/assets/jackson-kondili-x5VhI538fII-unsplash.jpg";
import img5 from "@/assets/lorenzo-herrera-p0j-mE6mGo4-unsplash.jpg";
import img6 from "@/assets/tom-hermans-9BoqXzEeQqM-unsplash.jpg";

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const heroImages = [
    img2.src,
    img3.src,
    img4.src,
    img5.src,
    img6.src,
  ];

  const words = [
    { text: "Discover", className: "text-white" },
    { text: "Fashion,", className: "text-white" },
    { text: "Tech", className: "text-blue-400" },
    { text: "&", className: "text-white" },
    { text: "More", className: "text-orange-500" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="relative w-full h-[700px] md:h-[800px] bg-slate-900">
      <ImagesSlider className="h-full" images={heroImages}>
        <div className="relative z-50 container-custom h-full flex flex-col items-center justify-center text-center px-4 pt-40">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium mb-6 animate-fade-in-up backdrop-blur-sm">
              <span className="text-base">🚀</span> The Ultimate Marketplace to Buy & Sell
            </div>

            <div className="mb-6 flex justify-center">
              <TypewriterEffect words={words} className="text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow-sm leading-tight text-white" cursorClassName="bg-primary-500" />
            </div>
            <p className="text-xl md:text-2xl text-slate-200 mb-10 font-medium max-w-2xl mx-auto">
              Find the best deals on fashion, electronics, home goods, and more.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative w-full max-w-2xl mx-auto group mb-12">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-slate-400 group-focus-within:text-primary-400 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search for items, brands, or members..."
                className="w-full pl-14 pr-36 py-4 rounded-full text-lg bg-white/95 backdrop-blur-md text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-4 focus:ring-primary-500/30 shadow-2xl border border-white/20 transition-all"
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

            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12 text-sm font-bold text-white drop-shadow-md">
              <div className="flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
                Verified Sellers
              </div>
              <div className="flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
                Secure Payments
              </div>
              <div className="flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
                Instant Delivery
              </div>
            </div>
          </motion.div>
        </div>
      </ImagesSlider>
    </div>
  );
}
