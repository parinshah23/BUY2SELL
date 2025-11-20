"use client";

import { useWishlist } from "@/context/WishlistContext";
import NewProductCard from "@/components/NewProductCard";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Heart, X, Trash2 } from "lucide-react";

export default function WishlistPage() {
  const { wishlist, clearWishlist } = useWishlist();
  const router = useRouter();

  return (
    <div className="bg-secondary-50 min-h-screen py-12">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900 flex items-center gap-3">
              <Heart className="text-red-500 fill-current" size={32} />
              My Wishlist
            </h1>
            <p className="text-secondary-500 mt-2">
              {wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved for later
            </p>
          </div>

          {wishlist.length > 0 && (
            <button
              onClick={clearWishlist}
              className="text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 font-medium"
            >
              <Trash2 size={18} />
              Clear All
            </button>
          )}
        </div>

        {wishlist.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-white rounded-3xl border border-dashed border-secondary-200"
          >
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart size={40} className="text-red-300" />
            </div>
            <h2 className="text-2xl font-bold text-secondary-900 mb-2">Your wishlist is empty</h2>
            <p className="text-secondary-500 mb-8 max-w-md mx-auto">
              Browse our collection and save your favorite items to find them easily later.
            </p>
            <button
              onClick={() => router.push("/products")}
              className="bg-primary-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/30"
            >
              Browse Products
            </button>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {wishlist.map((product) => (
              <motion.div key={product.id} layout>
                <NewProductCard
                  product={product}
                  onView={() => router.push(`/user/products/${product.id}`)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}