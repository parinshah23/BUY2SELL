"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { Loader2, Check, X, Eye, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { getImageUrl } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link"; // Assuming we link to public product page

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingProducts = async () => {
    try {
      const res = await axios.get("/admin/products/pending");
      setProducts(res.data.products);
    } catch (error) {
      console.error("Error fetching pending products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingProducts();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      await axios.post(`/admin/products/${id}/approve`);
      toast.success("Product approved for listing");
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      toast.error("Failed to approve product");
    }
  };

  const handleReject = async (id: number) => {
    try {
      await axios.post(`/admin/products/${id}/reject`);
      toast.success("Product rejected");
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      toast.error("Failed to reject product");
    }
  };

  if (loading) return <Loader2 className="animate-spin text-primary-600 m-8" />;

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-secondary-100">
      <h1 className="text-2xl font-bold text-secondary-900 mb-6">Product Moderation</h1>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-secondary-50 rounded-2xl">
          <ShoppingBag className="mx-auto h-12 w-12 text-secondary-300 mb-4" />
          <p className="text-secondary-500 font-medium">No products pending approval.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {products.map((product) => (
            <div key={product.id} className="flex flex-col sm:flex-row gap-6 p-6 rounded-xl border border-secondary-100 items-start sm:items-center hover:bg-secondary-50 transition-colors">

              {/* Image */}
              <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 border border-secondary-200 bg-white">
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={getImageUrl(product.images[0])}
                    alt={product.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-secondary-300 text-xs">No Img</div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-lg text-secondary-900">{product.title}</h3>
                  <span className="font-bold text-primary-600">€{product.price}</span>
                </div>
                <p className="text-secondary-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                <div className="flex items-center gap-4 text-xs text-secondary-500">
                  <span>Seller: <span className="font-medium text-secondary-700">{product.user?.name || "Unknown"}</span></span>
                  <span>Date: {new Date(product.createdAt).toLocaleDateString()}</span>
                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full font-medium">Pending Review</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex sm:flex-col gap-2 flex-shrink-0 w-full sm:w-auto mt-4 sm:mt-0">
                <button
                  onClick={() => handleApprove(product.id)}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors shadow-sm flex items-center justify-center gap-2 text-sm"
                >
                  <Check size={16} /> Approve
                </button>

                {/* View Details Link - Opens in new tab usually or modal */}
                <Link href={`/user/products/${product.id}`} target="_blank">
                  <button className="w-full px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg font-medium hover:bg-secondary-200 transition-colors flex items-center justify-center gap-2 text-sm">
                    <Eye size={16} /> View
                  </button>
                </Link>

                <button
                  onClick={() => handleReject(product.id)}
                  className="flex-1 px-4 py-2 border border-red-200 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <X size={16} /> Reject
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
