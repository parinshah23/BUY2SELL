"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "@/lib/axios";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { Save, ArrowLeft, Upload, Loader2, X, MapPin } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import { toast } from "sonner";
import { ChevronDown } from "lucide-react";

const CATEGORIES = [
  "Electronics",
  "Fashion",
  "Home",
  "Books",
  "Sports",
  "Furniture",
  "Vehicles",
  "Other",
];

export default function AddProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");

  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/user/login");
    }
  }, [user, authLoading, router]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    location: "",
    images: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // ✅ Fetch product data if editing
  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/products/${productId}`);
        const { product } = res.data;

        setForm({
          title: product.title,
          description: product.description,
          price: product.price,
          category: product.category,
          location: product.location || "",
          images: product.images || (product.image ? [product.image] : []),
        });

        setIsEditing(true);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Unable to load product data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // ✅ Handle form field updates
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Handle Image Upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const formData = new FormData();
    Array.from(e.target.files).forEach((file) => {
      formData.append("images", file);
    });

    const token = localStorage.getItem("token");

    try {
      setUploading(true);
      const res = await axios.post("/upload/multiple", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setForm((prev) => ({
        ...prev,
        images: [...prev.images, ...res.data.imageUrls],
      }));
      toast.success("Images uploaded successfully");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Failed to upload images.");
    } finally {
      setUploading(false);
    }
  };

  // ✅ Remove Image
  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // ✅ Handle form submit (Create / Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...form,
        price: Number(form.price),
      };

      const token = localStorage.getItem("token");

      if (isEditing) {
        // Update product
        await axios.put(
          `/products/${productId}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Product updated successfully!");
      } else {
        // Create product
        await axios.post(
          "/products",
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Product added successfully!");
      }

      router.push("/user/my-products");
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error(error.response?.data?.message || "Failed to save product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-secondary-50 min-h-screen py-12">
      <div className="container-custom max-w-3xl">
        <button
          onClick={() => router.back()}
          className="mb-8 text-secondary-500 hover:text-primary-600 flex items-center gap-2 transition-colors font-medium"
        >
          <ArrowLeft size={20} />
          Back to My Products
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-3xl shadow-xl border border-secondary-100"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-secondary-900">
              {isEditing ? "Edit Product" : "Add New Product"}
            </h1>
            <p className="text-secondary-500 mt-2">
              {isEditing ? "Update your product details below" : "Fill in the details to list your product"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2" htmlFor="title">Product Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Modern Sofa"
                required
                className="w-full px-4 py-3 rounded-xl border border-secondary-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2" htmlFor="description">Product Description</label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="e.g. A comfortable and stylish sofa for your living room."
                rows={4}
                required
                className="w-full px-4 py-3 rounded-xl border border-secondary-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2" htmlFor="price">Price (₹)</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="e.g. 500"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-secondary-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2" htmlFor="category">Category</label>
                <div className="relative">
                  <select
                    id="category"
                    name="category"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-secondary-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all appearance-none bg-white"
                  >
                    <option value="" disabled>Select a category</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-secondary-500">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2" htmlFor="location">Location</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-secondary-400" />
                </div>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Mumbai, Maharashtra"
                  required
                  className="w-full pl-10 px-4 py-3 rounded-xl border border-secondary-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">Product Images</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                {form.images.map((img, index) => (
                  <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-secondary-200">
                    <img
                      src={getImageUrl(img)}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                <label className="border-2 border-dashed border-secondary-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-all aspect-square">
                  {uploading ? (
                    <Loader2 className="animate-spin text-primary-500" />
                  ) : (
                    <>
                      <Upload className="text-secondary-400 mb-2" />
                      <span className="text-xs text-secondary-500 font-medium">Upload</span>
                    </>
                  )}
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>
              <p className="text-xs text-secondary-500">Upload up to 5 images. First image will be the cover.</p>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading || uploading}
                className="w-full bg-primary-600 text-white px-6 py-4 rounded-xl font-semibold hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  <>
                    <Save size={20} />
                    {isEditing ? "Update Product" : "Publish Product"}
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
