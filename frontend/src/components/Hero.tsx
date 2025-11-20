"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-secondary-50 pt-32 pb-20 lg:pt-40 lg:pb-28">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary-200/30 blur-3xl" />
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] rounded-full bg-accent-200/30 blur-3xl" />
      </div>

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
              <h1 className="text-4xl md:text-6xl font-extrabold text-secondary-900 leading-tight mb-6">
                Discover Unique <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-500">
                  Digital Assets
                </span>
              </h1>
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
                  href="/user/add-product"
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
          <div className="flex-1 w-full max-w-lg lg:max-w-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-secondary-100 bg-white p-4">
                {/* Placeholder for Hero Image - using a gradient block for now if no image */}
                <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-secondary-100 to-secondary-50 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-90 hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                {/* Floating Card 1 */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg border border-secondary-100 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <span className="font-bold text-lg">€</span>
                  </div>
                  <div>
                    <p className="text-xs text-secondary-500">Total Sales</p>
                    <p className="text-lg font-bold text-secondary-900">€1.2M+</p>
                  </div>
                </motion.div>

                {/* Floating Card 2 */}
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -top-6 -right-6 bg-white p-4 rounded-xl shadow-lg border border-secondary-100 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <UserIcon />
                  </div>
                  <div>
                    <p className="text-xs text-secondary-500">Active Users</p>
                    <p className="text-lg font-bold text-secondary-900">50k+</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function UserIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
  )
}
