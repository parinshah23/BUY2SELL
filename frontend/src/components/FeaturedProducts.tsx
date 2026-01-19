"use client";

import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import NewProductCard from "@/components/NewProductCard";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function FeaturedProducts() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            try {
                // Fetch fresh products (limit 8)
                const res = await axios.get("/products?limit=8");
                setProducts(res.data.products || []);
            } catch (error) {
                console.error("Error fetching featured products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedProducts();
    }, []);

    if (loading) {
        return <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary-600" size={32} /></div>;
    }

    if (products.length === 0) {
        return <div className="text-center py-12 text-secondary-500">No products found.</div>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, index) => (
                <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                    <NewProductCard
                        product={product}
                        onView={() => router.push(`/user/products/${product.id}`)}
                    />
                </motion.div>
            ))}
        </div>
    );
}
