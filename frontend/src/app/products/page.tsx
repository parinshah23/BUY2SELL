"use client";

import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import NewProductCard from "@/components/NewProductCard";
import { motion } from "framer-motion";
import Loader from "@/components/Loader";

export default function ProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: "",
        category: "All",
        location: "",
        sort: "default",
    });

    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const limit = 12;
    const [total, setTotal] = useState(0);

    const router = useRouter();

    // ✅ Fetch products with server-side filtering
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                search: filters.search,
                category: filters.category,
                location: filters.location,
                sort: filters.sort,
            });

            const res = await axios.get(`/products?${queryParams.toString()}`);
            setProducts(res.data.products || []);
            setPages(res.data.pages || 1);
            setTotal(res.data.total || 0);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch when filters or page changes
    useEffect(() => {
        fetchProducts();
    }, [page, filters]);

    // Reset page when filters change
    const handleFilterChange = (newFilters: any) => {
        setFilters(newFilters);
        setPage(1);
    };

    return (
        <div className="bg-secondary-50 min-h-screen pt-24 pb-20">
            <div className="container-custom">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-secondary-900">Browse Collection</h1>
                        <p className="text-secondary-500 mt-2">Find exactly what you're looking for</p>
                    </div>

                    <div className="w-full md:w-auto">
                        <SearchBar onFilterChange={handleFilterChange} />
                    </div>
                </div>



                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl h-96 animate-pulse" />
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-secondary-200">
                        <p className="text-xl text-secondary-500 font-medium">No products found matching your filters.</p>
                        <button
                            onClick={() => handleFilterChange({ search: "", category: "All", location: "", sort: "default" })}
                            className="mt-4 text-primary-600 font-semibold hover:underline"
                        >
                            Clear all filters
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="text-sm text-secondary-500 mb-6">
                            Showing <span className="font-semibold text-secondary-900">{(page - 1) * limit + 1}</span> – <span className="font-semibold text-secondary-900">{Math.min(page * limit, total)}</span> of <span className="font-semibold text-secondary-900">{total}</span> results
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {products.map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                    <NewProductCard
                                        product={product}
                                        onEdit={() => router.push(`/user/add-product?id=${product.id}`)}
                                        onView={() => router.push(`/user/products/${product.id}`)}
                                    />
                                </motion.div>
                            ))}
                        </div>

                        {/* Pagination */}
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
                )}
            </div>
        </div>
    );
}
