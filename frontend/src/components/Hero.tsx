"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag } from "lucide-react";

import { AuroraBackground } from "@/components/ui/aurora-background";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { useAuth } from "@/hooks/useAuth";

import axios from "@/lib/axios";
import { useEffect, useState } from "react";

export default function Hero() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    inventoryValue: 0,
    totalProducts: 0,
    users: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("/stats");
        setStats({
          inventoryValue: res.data.totalInventoryValue,
          totalProducts: res.data.totalProducts,
          users: res.data.totalUsers,
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <AuroraBackground>
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28 w-full">
        <div className="container-custom relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Text Content */}
            <div className="flex-1 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-block py-1 px-3 rounded-full bg-primary-100 text-primary-700 text-sm font-semibold mb-6">
                  🚀 The #1 Marketplace for Creators
                </span>
                <div className="text-4xl md:text-6xl font-extrabold text-secondary-900 leading-tight mb-6 flex flex-col items-center lg:items-start">
                  <span>Discover Unique</span>
                  <TypewriterEffect
                    words={[
                      {
                        text: "Digital",
                        className: "text-primary-600",
                      },
                      {
                        text: "Assets",
                        className: "text-accent-500",
                      },
                    ]}
                    className="text-4xl md:text-6xl font-extrabold"
                    cursorClassName="bg-accent-500"
                  />
                </div>
                <p className="text-lg text-secondary-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Buy and sell high-quality products in a secure and professional environment.
                  Join thousands of creators and entrepreneurs today.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <Link
                    href="/products"
                    className="w-full sm:w-auto px-8 py-4 bg-primary-600 text-white rounded-full font-semibold hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/30 flex items-center justify-center gap-2 group"
                  >
                    Start Exploring
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href={user ? "/user/add-product" : "/user/login"}
                    className="w-full sm:w-auto px-8 py-4 bg-white text-secondary-900 border border-secondary-200 rounded-full font-semibold hover:bg-secondary-50 transition-all flex items-center justify-center gap-2"
                  >
                    <ShoppingBag size={18} />
                    Start Selling
                  </Link>
                </div>

                <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 text-secondary-500 text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span>Verified Sellers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span>Secure Payments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span>Instant Delivery</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Hero Image / Visual */}
            <div className="flex-1 w-full max-w-lg lg:max-w-none perspective-1000">
              <motion.div
                initial={{ opacity: 0, rotateX: 20, rotateY: -20, scale: 0.9 }}
                animate={{ opacity: 1, rotateX: 5, rotateY: -10, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{ transformStyle: "preserve-3d" }}
                className="relative z-10"
              >
                {/* Browser Window Frame */}
                <div className="relative rounded-xl bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden">
                  {/* Browser Header */}
                  <div className="h-8 bg-gray-50/50 border-b border-gray-100 flex items-center px-4 gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                    <div className="w-3 h-3 rounded-full bg-green-400/80" />
                  </div>

                  {/* Dashboard Content Mockup */}
                  <div className="p-6 grid grid-cols-12 gap-6 bg-gradient-to-br from-gray-50 to-white h-[400px]">
                    {/* Sidebar */}
                    <div className="col-span-3 space-y-3">
                      <div className="h-8 w-full bg-gray-200/50 rounded-lg animate-pulse" />
                      <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
                      <div className="h-4 w-1/2 bg-gray-100 rounded animate-pulse" />
                      <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse" />
                      <div className="mt-8 h-32 w-full bg-blue-50/50 rounded-xl border border-blue-100" />
                    </div>

                    {/* Main Content */}
                    <div className="col-span-9 space-y-6">
                      {/* Header Stats */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="h-24 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                          <div className="h-8 w-8 bg-indigo-100 rounded-full mb-2" />
                          <div className="h-4 w-16 bg-gray-100 rounded" />
                        </div>
                        <div className="h-24 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                          <div className="h-8 w-8 bg-purple-100 rounded-full mb-2" />
                          <div className="h-4 w-16 bg-gray-100 rounded" />
                        </div>
                        <div className="h-24 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                          <div className="h-8 w-8 bg-pink-100 rounded-full mb-2" />
                          <div className="h-4 w-16 bg-gray-100 rounded" />
                        </div>
                      </div>

                      {/* Chart Area */}
                      <div className="h-48 bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-end gap-2">
                        {[40, 70, 45, 90, 60, 80, 50, 75, 60, 95].map((h, i) => (
                          <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                            className="flex-1 bg-gradient-to-t from-primary-500 to-primary-300 rounded-t-sm opacity-80 hover:opacity-100 transition-opacity"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -right-8 top-20 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 z-20"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">
                      $
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Inventory Value</p>
                      <p className="text-lg font-bold text-gray-900">
                        {new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(stats.inventoryValue)}
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 15, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -left-8 bottom-20 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 z-20"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <ShoppingBag size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Total Products</p>
                      <p className="text-lg font-bold text-gray-900">{stats.totalProducts}</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </AuroraBackground >
  );
}


