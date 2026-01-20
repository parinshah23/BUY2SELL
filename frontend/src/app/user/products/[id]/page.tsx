"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import axios from "@/lib/axios";
import { useAuth } from "@/hooks/useAuth";
import Loader from "@/components/Loader";
import { ShoppingCart, Heart, Edit, Trash2, ArrowLeft, ShieldCheck, Truck, RotateCcw, MapPin, MessageCircle, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import { useWishlist } from "@/context/WishlistContext";
import { getImageUrl } from "@/lib/utils";
import { toast } from "sonner";
import OfferModal from "@/components/OfferModal";
import { Gavel } from "lucide-react";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { wishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ✅ Fetch product details
  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/products/${id}`);
        setProduct(res.data.product);
        // Set initial selected image
        if (res.data.product.images && res.data.product.images.length > 0) {
          setSelectedImage(res.data.product.images[0]);
        } else if (res.data.product.image) {
          setSelectedImage(res.data.product.image);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Fetch reviews
  useEffect(() => {
    if (!id) return;
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`/products/${id}/reviews`);
        setReviews(res.data.reviews || []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
  }, [id]);

  // ✅ Delete product
  const handleDelete = () => {
    toast("Are you sure you want to delete this product?", {
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            await axios.delete(`/products/${id}`);
            toast.success("Product deleted successfully!");
            router.push("/user/my-products");
          } catch (error) {
            console.error("Error deleting product:", error);
            toast.error("Failed to delete product.");
          }
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => { },
      },
    });
  };

  // Submit review
  const handleSubmitReview = async () => {
    if (!user) {
      router.push("/user/login");
      return;
    }
    try {
      setSubmitting(true);
      const res = await axios.post(`/products/${id}/reviews`, { rating, comment });
      setReviews([res.data.review, ...reviews]);
      setRating(5);
      setComment("");
      toast.success("Review submitted successfully!");
    } catch (error: any) {
      console.error("Error submitting review:", error);
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ Handle Chat
  const handleChat = async () => {
    if (!user) {
      router.push("/user/login");
      return;
    }
    try {
      const res = await axios.post("/chats", {
        productId: product.id,
        sellerId: product.userId,
      });
      router.push(`/user/chat?id=${res.data.chat.id}`);
    } catch (error) {
      console.error("Error starting chat:", error);
      toast.error("Failed to start chat.");
    }
  };

  const [buying, setBuying] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);

  // ✅ Handle Buy Now
  const handleBuyNow = async () => {
    if (!user) {
      router.push("/user/login");
      return;
    }
    // Redirect to Checkout Page
    router.push(`/orders/checkout/${product.id}`);
  };

  if (loading) return <Loader />;

  if (!product)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-secondary-500">
        <p className="text-xl font-medium mb-4">Product not found.</p>
        <button
          onClick={() => router.back()}
          className="text-primary-600 hover:underline flex items-center gap-2"
        >
          <ArrowLeft size={18} /> Go Back
        </button>
      </div>
    );

  const isOwner = user?.id === product?.userId;
  const isInWishlist = wishlist.some((item) => item.id === product.id);
  const images = product.images && product.images.length > 0 ? product.images : product.image ? [product.image] : [];

  return (
    <div className="bg-secondary-50 min-h-screen py-12 lg:py-20">
      <div className="container-custom">
        {/* Breadcrumb / Back */}
        <button
          onClick={() => router.back()}
          className="mb-8 text-secondary-500 hover:text-primary-600 flex items-center gap-2 transition-colors font-medium"
        >
          <ArrowLeft size={20} />
          Back to Products
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* 🖼️ Product Image Gallery */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative aspect-square lg:aspect-[4/3] rounded-3xl overflow-hidden bg-white shadow-xl border border-secondary-100"
            >
              {selectedImage ? (
                <Image
                  src={getImageUrl(selectedImage)}
                  alt={product.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex items-center justify-center h-full text-secondary-300 bg-secondary-100">
                  <span className="text-lg font-medium">No Image Available</span>
                </div>
              )}
            </motion.div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {images.map((img: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${selectedImage === img ? "border-primary-600 ring-2 ring-primary-100" : "border-transparent hover:border-secondary-300"
                      }`}
                  >
                    <Image
                      src={getImageUrl(img)}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 📝 Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-primary-600 font-semibold tracking-wider uppercase text-sm">
                {product.category || "General"}
              </span>
              {product.location && (
                <div className="flex items-center gap-1 text-secondary-500 text-sm">
                  <MapPin size={16} />
                  {product.location}
                </div>
              )}
            </div>

            <h1 className="text-3xl lg:text-5xl font-bold text-secondary-900 mb-6 leading-tight">
              {product.title}
            </h1>

            <div className="flex items-center gap-4 mb-8">
              <span className="text-3xl font-bold text-secondary-900">€{product.price}</span>
              <div className="flex items-center gap-1 text-yellow-400 text-sm">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>★</span>
                ))}
                <span className="text-secondary-400 ml-2">(No reviews yet)</span>
              </div>
            </div>

            <p className="text-secondary-600 text-lg leading-relaxed mb-10 border-b border-secondary-200 pb-10">
              {product.description}
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              {isOwner ? (
                <>
                  <button
                    onClick={() => router.push(`/user/add-product?id=${product.id}`)}
                    className="flex-1 bg-secondary-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-secondary-800 transition-all flex items-center justify-center gap-2"
                  >
                    <Edit size={20} />
                    Edit Product
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 bg-red-50 text-red-600 border border-red-100 px-8 py-4 rounded-xl font-semibold hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                  >
                    <Trash2 size={20} />
                    Delete
                  </button>
                </>
              ) : (
                <>
                  {product.status === "SOLD" ? (
                    <button disabled className="flex-1 bg-secondary-300 text-white px-8 py-4 rounded-xl font-semibold cursor-not-allowed flex items-center justify-center gap-2">
                      Sold Out
                    </button>
                  ) : (
                    <button
                      onClick={handleBuyNow}
                      disabled={buying}
                      className="flex-[2] bg-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-700 transition-all shadow-lg shadow-green-500/30 flex items-center justify-center gap-2 transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {buying ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <CreditCard size={20} />}
                      Buy Now
                    </button>
                  )}

                  <button
                    onClick={() => setIsOfferModalOpen(true)}
                    className="flex-1 bg-white text-secondary-900 border border-secondary-200 px-8 py-4 rounded-xl font-semibold hover:bg-secondary-50 transition-all flex items-center justify-center gap-2 transform active:scale-95"
                  >
                    <Gavel size={20} />
                    Make Offer
                  </button>
                  <button
                    onClick={handleChat}
                    className="flex-1 bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/30 flex items-center justify-center gap-2 transform active:scale-95"
                  >
                    <MessageCircle size={20} />
                    Chat
                  </button>
                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`flex-1 border px-8 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${isInWishlist
                      ? "border-red-200 bg-red-50 text-red-500"
                      : "border-secondary-200 text-secondary-700 hover:bg-secondary-50"
                      }`}
                  >
                    <Heart size={20} className={isInWishlist ? "fill-current" : ""} />
                  </button>
                </>
              )}
            </div>

            <OfferModal
              isOpen={isOfferModalOpen}
              onClose={() => setIsOfferModalOpen(false)}
              productId={product.id}
              productPrice={product.price}
              productTitle={product.title}
              productImage={product.images?.[0] || product.image}
            />

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 mb-10">
              <div className="flex flex-col items-center text-center gap-2 p-4 rounded-xl bg-white border border-secondary-100">
                <ShieldCheck className="text-green-500" size={24} />
                <span className="text-xs font-medium text-secondary-600">Secure Payment</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2 p-4 rounded-xl bg-white border border-secondary-100">
                <Truck className="text-blue-500" size={24} />
                <span className="text-xs font-medium text-secondary-600">Fast Delivery</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2 p-4 rounded-xl bg-white border border-secondary-100">
                <RotateCcw className="text-orange-500" size={24} />
                <span className="text-xs font-medium text-secondary-600">Easy Returns</span>
              </div>
            </div>

            {/* Seller Info */}
            {product.user && (
              <div className="bg-white p-6 rounded-2xl border border-secondary-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold text-xl overflow-hidden relative">
                  {product.user.avatar ? (
                    <Image
                      src={getImageUrl(product.user.avatar)}
                      alt={product.user.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    product.user.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <p className="text-sm text-secondary-500">Sold by</p>
                  <p className="font-semibold text-secondary-900">{product.user.name}</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12 bg-white rounded-3xl shadow-sm border border-secondary-100 p-8">
          <h2 className="text-2xl font-bold text-secondary-900 mb-6">Customer Reviews</h2>

          {/* Average Rating */}
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-secondary-100">
            <div className="text-center">
              <p className="text-4xl font-bold text-secondary-900">
                {reviews.length > 0
                  ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
                  : "0.0"}
              </p>
              <div className="flex gap-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={`text-xl ${i < Math.round(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length) ? "text-yellow-400" : "text-secondary-200"}`}>
                    ★
                  </span>
                ))}
              </div>
              <p className="text-sm text-secondary-500 mt-1">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</p>
            </div>
          </div>

          {/* Review List */}
          <div className="space-y-6 mb-8">
            {reviews.length === 0 ? (
              <p className="text-secondary-500 text-center py-8">No reviews yet. Be the first to review!</p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="border-b border-secondary-100 pb-6 last:border-0">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold">
                      {review.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-secondary-900">{review.user.name}</p>
                        <p className="text-sm text-secondary-400">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`${i < review.rating ? "text-yellow-400" : "text-secondary-200"}`}>
                            ★
                          </span>
                        ))}
                      </div>
                      {review.comment && (
                        <p className="text-secondary-600">{review.comment}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Review Form */}
          {!isOwner && user && (
            <div className="bg-secondary-50 p-6 rounded-xl">
              <h3 className="font-semibold text-secondary-900 mb-4">Write a Review</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-secondary-700 mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className={`text-3xl ${star <= rating ? "text-yellow-400" : "text-secondary-200"} hover:scale-110 transition-transform`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-secondary-700 mb-2">Comment (Optional)</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all resize-none"
                  placeholder="Share your experience..."
                />
              </div>
              <button
                onClick={handleSubmitReview}
                disabled={submitting}
                className="bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
