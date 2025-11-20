"use client";
import { useEffect, useState } from "react";
import api from "@/lib/axios";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  location?: string;
  createdAt: string;
}

export default function ManageProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      setDeleting(id);
      await api.delete(`/products/${id}`);
      setProducts(products.filter((p) => p.id !== id));
      alert("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product.");
    } finally {
      setDeleting(null);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <p>Loading products...</p>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Manage Products</h2>

      {products.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <table className="min-w-full border border-gray-300 bg-white shadow-sm rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Title</th>
              <th className="py-2 px-4 text-left">Category</th>
              <th className="py-2 px-4 text-left">Location</th>
              <th className="py-2 px-4 text-left">Price</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="py-2 px-4">{p.id}</td>
                <td className="py-2 px-4 font-medium">{p.title}</td>
                <td className="py-2 px-4">{p.category}</td>
                <td className="py-2 px-4">{p.location || "N/A"}</td>
                <td className="py-2 px-4">€{p.price.toFixed(2)}</td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition"
                    disabled={deleting === p.id}
                  >
                    {deleting === p.id ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
