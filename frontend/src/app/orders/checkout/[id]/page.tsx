"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import axios from "@/lib/axios";
import { useAuth } from "@/hooks/useAuth";
import Loader from "@/components/Loader";
import { ArrowLeft, ShieldCheck, Truck, CreditCard, Wallet, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { getImageUrl } from "@/lib/utils";
import { toast } from "sonner";

export default function CheckoutPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuth();

    const [product, setProduct] = useState<any>(null);
    const [addresses, setAddresses] = useState<any[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<"STRIPE" | "WALLET">("STRIPE");
    const [wallet, setWallet] = useState<any>(null);
    const [fees, setFees] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (!user) {
            router.push("/user/login");
            return;
        }

        const fetchData = async () => {
            try {
                const [productRes, addressRes, walletRes] = await Promise.all([
                    axios.get(`/products/${id}`),
                    axios.get("/address"),
                    axios.get("/wallet")
                ]);

                setProduct(productRes.data.product);
                setAddresses(addressRes.data.addresses);
                setWallet(walletRes.data.wallet);

                if (addressRes.data.addresses.length > 0) {
                    const defaultAddr = addressRes.data.addresses.find((a: any) => a.isDefault);
                    setSelectedAddress(defaultAddr ? defaultAddr.id : addressRes.data.addresses[0].id);
                }

                // Fetch Preview/Fees
                const feeRes = await axios.post("/orders/preview", { productId: id });
                setFees(feeRes.data);

            } catch (error) {
                console.error("Error fetching checkout data:", error);
                toast.error("Failed to load checkout details");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, user, router]);

    const handlePay = async () => {
        if (!selectedAddress) {
            toast.error("Please select a shipping address");
            return;
        }

        setProcessing(true);

        try {
            if (paymentMethod === "WALLET") {
                const res = await axios.post("/orders/pay-with-wallet", {
                    productId: product.id,
                    addressId: selectedAddress
                });
                if (res.data.success) {
                    router.push("/orders/success?session_id=WALLET_PAYMENT");
                }
            } else {
                const res = await axios.post("/orders/checkout", {
                    productId: product.id,
                    addressId: selectedAddress
                });
                window.location.href = res.data.url;
            }
        } catch (error: any) {
            console.error("Payment error:", error);
            toast.error(error.response?.data?.message || "Payment failed");
            setProcessing(false);
        }
    };

    if (loading) return <Loader />;
    if (!product) return null;

    return (
        <div className="min-h-screen bg-secondary-50 py-12">
            <div className="container-custom max-w-5xl">
                <button
                    onClick={() => router.back()}
                    className="mb-8 text-secondary-500 hover:text-primary-600 flex items-center gap-2 transition-colors font-medium"
                >
                    <ArrowLeft size={20} />
                    Cancel Checkout
                </button>

                <h1 className="text-3xl font-bold text-secondary-900 mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT COLUMN: Input */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* 1. Shipping Address */}
                        <div className="bg-white p-6 rounded-3xl border border-secondary-100 shadow-sm">
                            <h2 className="text-xl font-bold text-secondary-900 mb-4 flex items-center gap-2">
                                <Truck className="text-primary-600" /> Shipping Address
                            </h2>

                            {addresses.length === 0 ? (
                                <div className="text-center py-6">
                                    <p className="text-secondary-500 mb-4">You have no saved addresses.</p>
                                    <button
                                        onClick={() => router.push("/user/addresses")}
                                        className="text-primary-600 font-semibold hover:underline"
                                    >
                                        + Add New Address
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {addresses.map((addr) => (
                                        <label
                                            key={addr.id}
                                            className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                                selectedAddress === addr.id
                                                ? "border-primary-600 bg-primary-50"
                                                : "border-secondary-100 hover:border-secondary-300"
                                            }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <input
                                                    type="radio"
                                                    name="address"
                                                    checked={selectedAddress === addr.id}
                                                    onChange={() => setSelectedAddress(addr.id)}
                                                    className="mt-1"
                                                />
                                                <div>
                                                    <p className="font-semibold text-secondary-900">{addr.name}</p>
                                                    <p className="text-secondary-600 text-sm">{addr.street}, {addr.city}</p>
                                                    <p className="text-secondary-600 text-sm">{addr.state} {addr.zip}, {addr.country}</p>
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                    <button
                                        onClick={() => router.push("/user/addresses")}
                                        className="text-primary-600 font-semibold text-sm hover:underline mt-2 block"
                                    >
                                        + Manage Addresses
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* 2. Payment Method */}
                        <div className="bg-white p-6 rounded-3xl border border-secondary-100 shadow-sm">
                            <h2 className="text-xl font-bold text-secondary-900 mb-4 flex items-center gap-2">
                                <CreditCard className="text-primary-600" /> Payment Method
                            </h2>

                            <div className="space-y-3">
                                {/* Credit Card */}
                                <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                    paymentMethod === "STRIPE" ? "border-primary-600 bg-primary-50" : "border-secondary-100"
                                }`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        checked={paymentMethod === "STRIPE"}
                                        onChange={() => setPaymentMethod("STRIPE")}
                                    />
                                    <div className="flex items-center gap-3">
                                        <div className="bg-white p-2 rounded-lg shadow-sm">
                                            <CreditCard size={24} className="text-secondary-700" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-secondary-900">Credit / Debit Card</p>
                                            <p className="text-xs text-secondary-500">Secure payment via Stripe</p>
                                        </div>
                                    </div>
                                </label>

                                {/* Wallet */}
                                <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                    paymentMethod === "WALLET" ? "border-primary-600 bg-primary-50" : "border-secondary-100"
                                } ${wallet?.balance < fees?.total ? "opacity-60 pointer-events-none bg-secondary-50" : ""}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        checked={paymentMethod === "WALLET"}
                                        onChange={() => setPaymentMethod("WALLET")}
                                        disabled={wallet?.balance < fees?.total}
                                    />
                                    <div className="flex items-center gap-3 w-full">
                                        <div className="bg-white p-2 rounded-lg shadow-sm">
                                            <Wallet size={24} className="text-secondary-700" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-secondary-900">My Wallet</p>
                                            <p className="text-xs text-secondary-500">Balance: €{wallet?.balance?.toFixed(2) || "0.00"}</p>
                                        </div>
                                        {wallet?.balance < fees?.total && (
                                            <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded">Insufficient</span>
                                        )}
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-3xl border border-secondary-100 shadow-lg sticky top-24">
                            <h2 className="text-xl font-bold text-secondary-900 mb-6">Order Summary</h2>

                            <div className="flex gap-4 mb-6 pb-6 border-b border-secondary-100">
                                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-secondary-100 flex-shrink-0">
                                    {product.images?.[0] || product.image ? (
                                        <Image
                                            src={getImageUrl(product.images?.[0] || product.image)}
                                            alt={product.title}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    ) : null}
                                </div>
                                <div>
                                    <p className="font-semibold text-secondary-900 line-clamp-1">{product.title}</p>
                                    <p className="text-sm text-secondary-500">{product.category}</p>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6 pb-6 border-b border-secondary-100">
                                <div className="flex justify-between text-secondary-600">
                                    <span>Item Price</span>
                                    <span>€{fees?.price.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-secondary-600">
                                    <span className="flex items-center gap-1">
                                        Buyer Protection <ShieldCheck size={14} className="text-green-500"/>
                                    </span>
                                    <span>€{fees?.protectionFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-secondary-600">
                                    <span>Shipping</span>
                                    <span>€{fees?.shippingCost.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="flex justify-between text-xl font-bold text-secondary-900 mb-8">
                                <span>Total to Pay</span>
                                <span>€{fees?.total.toFixed(2)}</span>
                            </div>

                            <button
                                onClick={handlePay}
                                disabled={processing || !selectedAddress}
                                className="w-full bg-primary-600 text-white py-4 rounded-xl font-semibold hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/30 flex items-center justify-center gap-2 transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {processing ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Pay €{fees?.total.toFixed(2)}
                                    </>
                                )}
                            </button>

                            <p className="text-xs text-secondary-400 text-center mt-4">
                                By clicking Pay, you agree to our Terms & Conditions.
                                Funds are held securely until you confirm receipt.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
