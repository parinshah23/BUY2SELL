"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Package, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import { SubSelectToggle } from "@/components/ui/sub-select-toggle";

interface Order {
    id: number;
    createdAt: string;
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

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get("/orders");
                setPurchases(res.data.purchases || []);
                setSales(res.data.sales || []);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
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
                {orders.map((order) => (
                    <Link
                        key={order.id}
                        href={`/user/products/${order.product.id}`}
                        className="bg-white rounded-xl border border-secondary-100 p-4 hover:shadow-md transition-shadow"
                    >
                        <div className="aspect-square relative mb-4 rounded-lg overflow-hidden bg-secondary-100">
                            {order.product.images && order.product.images.length > 0 ? (
                                <Image
                                    src={getImageUrl(order.product.images[0])}
                                    alt={order.product.title}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <ShoppingBag size={48} className="text-secondary-300" />
                                </div>
                            )}
                        </div>
                        <h3 className="font-semibold text-secondary-900 mb-2 line-clamp-2">
                            {order.product.title}
                        </h3>
                        <p className="text-primary-600 font-bold mb-2">€{order.product.price.toFixed(2)}</p>
                        <p className="text-sm text-secondary-500">
                            {type === "purchase" ? "Purchased" : "Sold"} on{" "}
                            {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                    </Link>
                ))}
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
