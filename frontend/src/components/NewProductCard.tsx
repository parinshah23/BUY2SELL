"use client";

import Image from "next/image";
import { Heart, Pencil, Trash2, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useWishlist } from "@/context/WishlistContext";
import "@/styles/NewProductCard.css";
import { getImageUrl } from "@/lib/utils";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";

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
    <CardContainer className="inter-var w-full" containerClassName="py-0 w-full">
      <CardBody className="bg-white relative group/card border-black/[0.1] w-full h-auto rounded-xl p-4 border shadow-sm hover:shadow-md transition-all">

        {/* Wishlist Button - Floating */}
        {user && (
          <CardItem
            translateZ="100"
            className="absolute top-4 right-4 z-20"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(product);
              }}
              className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors cursor-pointer pointer-events-auto"
              aria-label="Add to wishlist"
            >
              <Heart
                size={20}
                className={`transition ${isInWishlist ? "fill-red-500 text-red-500" : "text-gray-400"}`}
              />
            </button>
          </CardItem>
        )}

        <CardItem
          translateZ="50"
          className="w-full mt-2"
        >
          <div
            className="relative w-full h-48 rounded-xl overflow-hidden cursor-pointer group-hover/card:shadow-xl"
            onClick={onView}
          >
            {product.images && product.images.length > 0 ? (
              <Image
                src={getImageUrl(product.images[0])}
                alt={product.title}
                fill
                className="object-cover group-hover/card:scale-110 transition-transform duration-500"
                unoptimized
              />
            ) : product.image ? (
              <Image
                src={getImageUrl(product.image)}
                alt={product.title}
                fill
                className="object-cover group-hover/card:scale-110 transition-transform duration-500"
                unoptimized
              />
            ) : (
              <div className="bg-gray-200 flex items-center justify-center h-full text-gray-400">
                No Image
              </div>
            )}
          </div>
        </CardItem>

        <div className="mt-4 flex flex-col gap-2">
          <CardItem
            translateZ="60"
            className="text-xl font-bold text-neutral-600 truncate w-full"
          >
            {product.title}
          </CardItem>

          <CardItem
            as="p"
            translateZ="50"
            className="text-neutral-500 text-sm max-w-sm mt-1 line-clamp-2 h-10"
          >
            {product.description}
          </CardItem>

          <div className="flex justify-between items-center mt-4">
            <CardItem
              translateZ="40"
              className="px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold"
            >
              {product.category || "General"}
            </CardItem>

            <div className="flex flex-col items-end">
              <CardItem
                translateZ="40"
                className="text-lg font-bold text-secondary-900"
              >
                €{product.price}
              </CardItem>
              {product.stock !== undefined && (
                <CardItem
                  translateZ="30"
                  className={`text-xs font-bold ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {product.stock > 0 ? `${product.stock} in stock` : "Out of Stock"}
                </CardItem>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center mt-4 gap-2">
            {showOwnerControls ? (
              <>
                <CardItem
                  translateZ={60}
                  as="button"
                  onClick={onEdit}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-secondary-100 text-secondary-900 hover:bg-secondary-200 transition-colors flex items-center gap-1 flex-1 justify-center cursor-pointer pointer-events-auto"
                >
                  <Pencil size={14} /> Edit
                </CardItem>
                <CardItem
                  translateZ={60}
                  as="button"
                  onClick={onDelete}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center gap-1 flex-1 justify-center cursor-pointer pointer-events-auto"
                >
                  <Trash2 size={14} /> Delete
                </CardItem>
              </>
            ) : (
              <CardItem
                translateZ={60}
                as="button"
                onClick={onView}
                className="px-4 py-2 rounded-lg bg-primary-600 text-white text-xs font-bold hover:bg-primary-700 transition-colors flex items-center gap-2 w-full justify-center shadow-md shadow-primary-500/20 cursor-pointer pointer-events-auto"
              >
                <Eye size={14} /> View Details
              </CardItem>
            )}
          </div>
        </div>
      </CardBody>
    </CardContainer >
  );
}
