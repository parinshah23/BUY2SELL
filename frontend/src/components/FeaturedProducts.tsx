"use client";

import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import NewProductCard from "@/components/NewProductCard";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        // Fetch a few products to be featured
        const res = await axios.get("/products?limit=8");
        setProducts(res.data.products || []);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      }
    };

    fetchFeaturedProducts();
  }, []);

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <span className="text-primary-600 font-semibold tracking-wider uppercase text-sm">Curated Collection</span>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mt-2">Featured Products</h2>
          </div>
          <button
            onClick={() => router.push("/products")}
            className="group flex items-center gap-2 text-secondary-600 hover:text-primary-600 font-medium transition-colors"
          >
            View All Products
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <NewProductCard
                product={product}
                onView={() => router.push(`/user/products/${product.id}`)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
