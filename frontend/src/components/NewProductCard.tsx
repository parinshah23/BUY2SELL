"use client";

import Image from "next/image";
import { Heart, Pencil, Trash2, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useWishlist } from "@/context/WishlistContext";
import "@/styles/NewProductCard.css";
import { getImageUrl } from "@/lib/utils";

interface ProductCardProps {
  product: any;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showOwnerControls?: boolean;
}

export default function NewProductCard({
  product,
  onView,
  onEdit,
  onDelete,
  showOwnerControls = false,
}: ProductCardProps) {
  const { user } = useAuth();
  const { wishlist, toggleWishlist } = useWishlist();

  const isInWishlist = wishlist.some((item) => item.id === product.id);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="product-card"
    >
      {user && (
        <button
          onClick={() => toggleWishlist(product)}
          className="product-card-wishlist-button"
          aria-label="Add to wishlist"
        >
          <Heart
            size={20}
            className={`transition ${isInWishlist ? "fill-red-500 text-red-500" : "text-gray-400"
              }`}
          />
        </button>
      )}

      <div className="product-card-image" onClick={onView}>
        {product.images && product.images.length > 0 ? (
          <Image
            src={getImageUrl(product.images[0])}
            alt={product.title}
            fill
            className="image"
          />
        ) : product.image ? (
          <Image
            src={getImageUrl(product.image)}
            alt={product.title}
            fill
            className="image"
          />
        ) : (
          <div className="bg-gray-200 flex items-center justify-center h-full text-gray-400">
            No Image
          </div>
        )}
      </div>

      <div className="product-card-details">
        <h3 className="product-card-title">
          {product.title}
        </h3>
        <p className="product-card-description">
          {product.description}
        </p>

        <div className="product-card-footer">
          <span className="product-card-price">€{product.price}</span>
          <span className="product-card-category">
            {product.category || "General"}
          </span>
        </div>

        <div className="product-card-actions">
          {showOwnerControls ? (
            <>
              <button
                onClick={onEdit}
                className="product-card-button product-card-button-edit"
              >
                <Pencil size={14} /> Edit
              </button>
              <button
                onClick={onDelete}
                className="product-card-button product-card-button-delete"
              >
                <Trash2 size={14} /> Delete
              </button>
            </>
          ) : (
            <button
              onClick={onView}
              className="product-card-button product-card-button-view"
            >
              <Eye size={14} /> View Details
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
