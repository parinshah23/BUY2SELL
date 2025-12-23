"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ShoppingBag, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function OrderSuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");

    useEffect(() => {
        if (!sessionId) {
            router.push("/");
        }
    }, [sessionId, router]);

    if (!sessionId) return null;

    return (
        <div className="min-h-screen bg-secondary-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white max-w-md w-full rounded-3xl shadow-xl border border-secondary-100 overflow-hidden"
            >
                <div className="p-8 text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="text-green-600 w-10 h-10" />
                    </div>

                    <h1 className="text-3xl font-bold text-secondary-900 mb-2">Payment Successful!</h1>
                    <p className="text-secondary-500 mb-8">
                        Thank you for your purchase. Your order has been placed securely and the funds are held in escrow until you verify delivery.
                    </p>

                    <div className="space-y-4">
                        <Link
                            href="/user/orders"
                            className="block w-full bg-primary-600 text-white py-4 rounded-xl font-semibold hover:bg-primary-700 transition-all flex items-center justify-center gap-2"
                        >
                            <ShoppingBag size={20} />
                            View My Orders
                        </Link>

                        <Link
                            href="/"
                            className="block w-full bg-white text-secondary-600 py-4 rounded-xl font-semibold border border-secondary-200 hover:bg-secondary-50 transition-all"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>

                <div className="bg-secondary-50 p-6 text-center text-sm text-secondary-400 border-t border-secondary-100">
                    Order ID: {sessionId.slice(0, 10)}...
                </div>
            </motion.div>
        </div>
    );
}
