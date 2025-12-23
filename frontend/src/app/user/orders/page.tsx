"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Package, ShoppingBag, CheckCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import { SubSelectToggle } from "@/components/ui/sub-select-toggle";
import { toast } from "sonner";

interface Order {
    id: number;
    createdAt: string;
    status: string; // Add status
    product: {
        id: number;
        title: string;
        price: number;
        images: string[];
    };
}

export default function OrdersPage() {
    const [purchases, setPurchases] = useState<Order[]>([]);
    const [sales, setSales] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"purchases" | "sales">("purchases");

    // ✅ Handle Status Update
    const handleUpdateStatus = async (orderId: number, status: string) => {
        if (!confirm(`Are you sure you want to update status to ${status}?`)) return;
        try {
            await api.put(`/orders/${orderId}/status`, { status });
            // Optimistic Update
            setPurchases(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
            setSales(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
            toast.success("Order status updated");
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status");
        }
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get("/orders"); // This endpoint route in backend needs to match /my-orders or /orders
                setPurchases(res.data.orders || []); // Wait, previous implementation returned { orders } for my-orders
                // Correcting logic on the fly: backend has /my-orders and /my-sales separate
                // But in original orders,ts I combined them? Let's check backend/routes/orders.ts
                // Wait, I replaced backend/orders.ts with separate routes.
                // Frontend was expecting a combined /orders route?
                // Let's fix this fetch logic.
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };
        // fetchOrders(); // Commented out to replace fully
    }, []);

    // ✅ Correct Fetch Logic
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [purchasesRes, salesRes] = await Promise.all([
                    api.get("/orders/my-orders"),
                    api.get("/orders/my-sales")
                ]);
                setPurchases(purchasesRes.data.orders);
                setSales(salesRes.data.sales);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const renderOrders = (orders: Order[], type: "purchase" | "sale") => {
        if (orders.length === 0) {
            return (
                <div className="text-center py-12">
                    <Package size={48} className="mx-auto text-secondary-300 mb-4" />
                    <p className="text-secondary-500">No {type}s yet</p>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders.map((order) => {
                    const isSeller = type === "sale";
                    const isBuyer = type === "purchase";

                    return (
                        <div
                            key={order.id}
                            className="bg-white rounded-xl border border-secondary-100 p-4 hover:shadow-md transition-shadow flex flex-col"
                        >
                            <Link href={`/user/products/${order.product.id}`} className="flex-1 block">
                                <div className="aspect-square relative mb-4 rounded-lg overflow-hidden bg-secondary-100">
                                    {order.product.images && order.product.images.length > 0 ? (
                                        <Image
                                            src={getImageUrl(order.product.images[0])}
                                            alt={order.product.title}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <ShoppingBag size={48} className="text-secondary-300" />
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider shadow-sm text-secondary-800">
                                        {order.status}
                                    </div>
                                </div>
                                <h3 className="font-semibold text-secondary-900 mb-1 line-clamp-1">
                                    {order.product.title}
                                </h3>
                                <div className="flex justify-between items-center mb-4">
                                    <p className="text-primary-600 font-bold">€{order.product.price.toFixed(2)}</p>
                                    <p className="text-xs text-secondary-400">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </Link>

                            <div className="pt-4 border-t border-secondary-100 mt-auto space-y-2">
                                {/* Seller Actions */}
                                {isSeller && order.status === "PAID" && (
                                    <button
                                        onClick={() => handleUpdateStatus(order.id, "SHIPPED")}
                                        className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                                    >
                                        Mark as Shipped
                                    </button>
                                )}

                                {/* Buyer Actions */}
                                {isBuyer && (order.status === "SHIPPED" || order.status === "DELIVERED") && (
                                    <button
                                        onClick={() => handleUpdateStatus(order.id, "COMPLETED")}
                                        className="w-full bg-green-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
                                    >
                                        Confirm Receipt
                                    </button>
                                )}

                                {order.status === "COMPLETED" && (
                                    <div className="w-full bg-secondary-100 text-secondary-500 py-2 rounded-lg text-sm font-medium text-center flex items-center justify-center gap-1">
                                        <CheckCircle size={14} /> Completed
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-secondary-50 py-12">
            <div className="container-custom max-w-6xl">
                <h1 className="text-3xl font-bold text-secondary-900 mb-8">Order History</h1>

                {/* Tabs */}
                <div className="flex justify-center mb-8">
                    <SubSelectToggle
                        options={[
                            { label: "My Purchases", value: "purchases" },
                            { label: "My Sales", value: "sales" },
                        ]}
                        selected={activeTab}
                        onChange={(val) => setActiveTab(val)}
                    />
                </div>

                {/* Content */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white rounded-xl p-4 h-80 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <>
                        {activeTab === "purchases" && renderOrders(purchases, "purchase")}
                        {activeTab === "sales" && renderOrders(sales, "sale")}
                    </>
                )}
            </div>
        </div>
    );
}
