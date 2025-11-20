"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import NewProductCard from "@/components/NewProductCard";
import { Plus, Package, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function MyProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const [filters, setFilters] = useState({
    search: "",
    category: "All",
    sort: "default",
  });

  // ✅ Pagination States
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 9;

  // ✅ Fetch user's own products with pagination
  const fetchMyProducts = async (pageNumber = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`/products/my?page=${pageNumber}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProducts(res.data.products || []);
      setFilteredProducts(res.data.products || []);
      setPages(res.data.pages || 1);
      setTotal(res.data.total || 0);
    } catch (err: any) {
      console.error("Error fetching my products:", err);
      setError(err.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProducts(page);
  }, [page]);

  // ✅ Filter logic
  useEffect(() => {
    let temp = [...products];

    if (filters.search) {
      temp = temp.filter((p) =>
        p.title.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.category !== "All") {
      temp = temp.filter(
        (p) => p.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    if (filters.sort === "low-high") {
      temp = temp.sort((a, b) => a.price - b.price);
    } else if (filters.sort === "high-low") {
      temp = temp.sort((a, b) => b.price - a.price);
    } else if (filters.sort === "latest") {
      temp = temp.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    setFilteredProducts(temp);
  }, [filters, products]);

  // ✅ Delete product
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setFilteredProducts((prev) => prev.filter((p) => p.id !== id));
      setTotal((prev) => prev - 1);
    } catch (err: any) {
      console.error("Error deleting product:", err);
      alert(err.response?.data?.message || "Failed to delete product");
    }
  };

  return (
    <ProtectedRoute>
      <div className="bg-secondary-50 min-h-screen py-12">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
            <div>
              <h1 className="text-3xl font-bold text-secondary-900 flex items-center gap-3">
                <Package className="text-primary-600" size={32} />
                My Listed Products
              </h1>
              <p className="text-secondary-500 mt-2">Manage your product listings</p>
            </div>
            <button
              onClick={() => router.push("/user/add-product")}
              className="bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/30 flex items-center gap-2"
            >
              <Plus size={20} />
              Add New Product
            </button>
          </div>

          <SearchBar onFilterChange={setFilters} />

          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-96 animate-pulse" />
              ))}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl flex items-center gap-3 mb-8">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          {!loading && !error && (
            <>
              {filteredProducts.length > 0 ? (
                <>
                  <div className="text-sm text-secondary-500 mb-6">
                    Showing <span className="font-semibold text-secondary-900">{(page - 1) * limit + 1}</span> – <span className="font-semibold text-secondary-900">{Math.min(page * limit, total)}</span> of <span className="font-semibold text-secondary-900">{total}</span> results
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <NewProductCard
                          product={product}
                          onDelete={() => handleDelete(product.id)}
                          onEdit={() => router.push(`/user/add-product?id=${product.id}`)}
                          onView={() => router.push(`/user/products/${product.id}`)}
                          showOwnerControls={true}
                        />
                      </motion.div>
                    ))}
                  </div>

                  {pages > 1 && (
                    <div className="flex justify-center items-center mt-16 gap-4">
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-6 py-2.5 rounded-full border border-secondary-200 bg-white text-secondary-700 font-medium hover:bg-secondary-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Previous
                      </button>

                      <span className="text-secondary-600 font-medium">
                        Page {page} of {pages}
                      </span>

                      <button
                        onClick={() => setPage((p) => Math.min(pages, p + 1))}
                        disabled={page === pages}
                        className="px-6 py-2.5 rounded-full bg-primary-600 text-white font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-primary-500/20"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-secondary-200">
                  <Package className="mx-auto text-secondary-300 mb-4" size={48} />
                  <p className="text-xl text-secondary-500 font-medium">You haven't listed any products yet.</p>
                  <button
                    onClick={() => router.push("/user/add-product")}
                    className="mt-4 text-primary-600 font-semibold hover:underline"
                  >
                    Start selling today
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
