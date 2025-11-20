"use client";

import Image from "next/image";
import { Heart, Pencil, Trash2, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useWishlist } from "@/context/WishlistContext";

interface ProductCardProps {
  product: any;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showOwnerControls?: boolean; // ✅ Enables edit/delete buttons
}

export default function ProductCard({
  product,
  onView,
  onEdit,
  onDelete,
  showOwnerControls = false,
}: ProductCardProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { wishlist, toggleWishlist } = useWishlist();

  const isInWishlist = wishlist.some((item) => item.id === product.id);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition relative"
    >
      {/* ❤️ Wishlist Icon */}
      {user && (
        <button
          onClick={() => toggleWishlist(product)}
          className="absolute top-3 right-3 z-10"
          aria-label="Add to wishlist"
        >
          <Heart
            size={22}
            className={`${
              isInWishlist ? "fill-red-500 text-red-500" : "text-gray-400"
            } hover:scale-110 transition`}
          />
        </button>
      )}

      {/* 🖼 Product Image */}
      {product.image ? (
        <div className="relative w-full h-48">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="bg-gray-200 flex items-center justify-center h-48 text-gray-400">
          No Image
        </div>
      )}

      {/* 📦 Product Details */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate">
          {product.title}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2 mb-2">
          {product.description}
        </p>

        <div className="flex justify-between items-center mb-3">
          <span className="text-blue-600 font-semibold">₹{product.price}</span>
          <span className="bg-gray-100 text-gray-700 px-2 py-1 text-xs rounded">
            {product.category || "General"}
          </span>
        </div>

        {/* 🧭 Action Buttons */}
        <div className="flex justify-between items-center">
          {showOwnerControls ? (
            <>
              {/* Edit Button */}
              <button
                onClick={onEdit}
                className="flex items-center gap-1 text-yellow-600 border border-yellow-600 px-3 py-1 rounded-lg text-sm hover:bg-yellow-600 hover:text-white transition"
              >
                <Pencil size={14} /> Edit
              </button>

              {/* Delete Button */}
              <button
                onClick={onDelete}
                className="flex items-center gap-1 text-red-600 border border-red-600 px-3 py-1 rounded-lg text-sm hover:bg-red-600 hover:text-white transition"
              >
                <Trash2 size={14} /> Delete
              </button>
            </>
          ) : (
            <button
              onClick={onView}
              className="flex items-center gap-1 text-blue-600 border border-blue-600 px-3 py-1 rounded-lg text-sm hover:bg-blue-600 hover:text-white transition"
            >
              <Eye size={14} /> View
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
