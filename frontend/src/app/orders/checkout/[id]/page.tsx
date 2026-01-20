"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import axios from "@/lib/axios";
import { useAuth } from "@/hooks/useAuth";
import Loader from "@/components/Loader";
import { ArrowLeft, ShieldCheck, Truck, CreditCard, Wallet, MapPin, Phone, Package, CheckCircle } from "lucide-react";
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
    const [shippingProvider, setShippingProvider] = useState<string>("Mondial Relay");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [wallet, setWallet] = useState<any>(null);
    const [fees, setFees] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    // Mock Providers
    const shippingProviders = [
        { name: "Mondial Relay", price: 3.99, icon: <Package size={20} />, subtext: "Locker Access" },
        { name: "UPS Access Point", price: 4.50, icon: <Truck size={20} />, subtext: "Locker Access" },
        { name: "Home Delivery", price: 6.99, icon: <MapPin size={20} />, subtext: "Direct to door" },
    ];

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

                // Initial Preview Check (default provider)
                updatePreview(id as string, "Mondial Relay");

            } catch (error) {
                console.error("Error fetching checkout data:", error);
                toast.error("Failed to load checkout details");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, user, router]);

    const updatePreview = async (prodId: string, provider: string) => {
        try {
            const feeRes = await axios.post("/orders/preview", {
                productId: prodId,
                shippingProvider: provider
            });
            setFees(feeRes.data);
        } catch (error) {
            console.error("Error updating preview:", error);
        }
    };

    // Update fees when provider changes
    useEffect(() => {
        if (id) {
            updatePreview(id as string, shippingProvider);
        }
    }, [shippingProvider, id]);

    const handlePay = async () => {
        if (!selectedAddress) {
            toast.error("Please select a shipping address");
            return;
        }
        if (!phoneNumber || phoneNumber.length < 8) {
            toast.error("Please enter a valid phone number");
            return;
        }

        setProcessing(true);

        try {
            const payload = {
                productId: product.id,
                addressId: selectedAddress,
                shippingProvider
            };

            if (paymentMethod === "WALLET") {
                const res = await axios.post("/orders/pay-with-wallet", payload);
                if (res.data.success) {
                    router.push("/orders/success?session_id=WALLET_PAYMENT");
                }
            } else {
                const res = await axios.post("/orders/checkout", payload);
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
        <div className="min-h-screen bg-[#F2F2F2] py-8"> {/* Vinted-like grey background */}
            <div className="container-custom max-w-4xl mx-auto">

                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => router.back()} className="p-2 hover:bg-white rounded-full transition-colors">
                        <ArrowLeft size={24} className="text-secondary-600" />
                    </button>
                    <h1 className="text-2xl font-bold text-secondary-900">Checkout</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* LEFT COLUMN: Main Form */}
                    <div className="lg:col-span-2 space-y-4">

                        {/* Order Item */}
                        <div className="bg-white p-4 rounded-md shadow-sm border border-secondary-200 flex gap-4">
                            <div className="relative w-20 h-20 rounded-md overflow-hidden bg-secondary-100 flex-shrink-0 border border-secondary-200">
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
                            <div className="flex-1">
                                <h3 className="font-semibold text-secondary-900 line-clamp-1">{product.title}</h3>
                                <p className="text-secondary-500 text-sm">{product.category}</p>
                                <div className="mt-2 flex items-center gap-2">
                                    <span className="font-bold text-secondary-900">€{fees?.price.toFixed(2)}</span>
                                    {fees?.isOffer && (
                                        <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded">Offer Price</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Delivery Section */}
                        <div className="bg-white p-6 rounded-md shadow-sm border border-secondary-200">
                            <h2 className="text-lg font-bold text-secondary-900 mb-4">Delivery</h2>

                            {/* Address Selection */}
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-sm font-semibold text-secondary-700">Shipping Address</h3>
                                    <button onClick={() => router.push("/user/addresses")} className="text-primary-600 text-sm font-medium hover:underline">Edit</button>
                                </div>
                                {addresses.length > 0 ? (
                                    <div className="p-3 border border-secondary-200 rounded-md bg-secondary-50 flex items-start gap-3">
                                        <MapPin className="text-secondary-400 mt-1" size={18} />
                                        <div>
                                            {addresses.map(addr => (
                                                <div key={addr.id} className={`${selectedAddress === addr.id ? "block" : "hidden"}`}>
                                                    <p className="font-medium text-secondary-900">{addr.name}</p>
                                                    <p className="text-secondary-600 text-sm">{addr.street}, {addr.city} {addr.zip}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <button onClick={() => router.push("/user/addresses")} className="w-full py-2 border border-dashed border-secondary-300 text-secondary-500 rounded-md hover:bg-secondary-50">
                                        + Add Address
                                    </button>
                                )}
                            </div>

                            {/* Provider Selection */}
                            <div>
                                <h3 className="text-sm font-semibold text-secondary-700 mb-3">Delivery Options</h3>
                                <div className="space-y-2">
                                    {shippingProviders.map((prov) => (
                                        <label key={prov.name} className={`flex items-center justify-between p-4 rounded-md border cursor-pointer transition-all ${shippingProvider === prov.name ? "border-primary-600 bg-primary-50/10" : "border-secondary-200 hover:border-secondary-300"
                                            }`}>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="radio"
                                                    name="provider"
                                                    checked={shippingProvider === prov.name}
                                                    onChange={() => setShippingProvider(prov.name)}
                                                    className="w-4 h-4 text-primary-600"
                                                />
                                                <div className="text-secondary-600">{prov.icon}</div>
                                                <div>
                                                    <p className="font-semibold text-secondary-900 text-sm">{prov.name}</p>
                                                    <p className="text-xs text-secondary-500">{prov.subtext}</p>
                                                </div>
                                            </div>
                                            <span className="font-bold text-secondary-900 text-sm">€{prov.price.toFixed(2)}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Phone Input */}
                            <div className="mt-6">
                                <h3 className="text-sm font-semibold text-secondary-700 mb-2">Contact Number</h3>
                                <div className="flex items-center border border-secondary-200 rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-primary-100 focus-within:border-primary-500">
                                    <Phone className="text-secondary-400 mr-2" size={18} />
                                    <input
                                        type="tel"
                                        placeholder="+1 234 567 890"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className="w-full outline-none text-secondary-900 text-sm"
                                    />
                                </div>
                                <p className="text-xs text-secondary-400 mt-1">Required for carrier notifications.</p>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white p-6 rounded-md shadow-sm border border-secondary-200">
                            <h2 className="text-lg font-bold text-secondary-900 mb-4">Payment</h2>
                            <div className="space-y-3">
                                <label className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer ${paymentMethod === "STRIPE" ? "border-primary-600 bg-primary-50/10" : "border-secondary-200"}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        checked={paymentMethod === "STRIPE"}
                                        onChange={() => setPaymentMethod("STRIPE")}
                                    />
                                    <div className="flex flex-1 justify-between items-center">
                                        <span className="text-sm font-medium text-secondary-900">Card Payment</span>
                                        <div className="flex gap-1">
                                            {/* Icons */}
                                            <div className="w-8 h-5 bg-secondary-200 rounded"></div>
                                            <div className="w-8 h-5 bg-secondary-200 rounded"></div>
                                        </div>
                                    </div>
                                </label>

                                <label className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer ${paymentMethod === "WALLET" ? "border-primary-600 bg-primary-50/10" : "border-secondary-200"} ${wallet?.balance < fees?.total ? "opacity-60" : ""}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        checked={paymentMethod === "WALLET"}
                                        onChange={() => setPaymentMethod("WALLET")}
                                        disabled={wallet?.balance < fees?.total}
                                    />
                                    <div className="flex flex-1 justify-between items-center">
                                        <div>
                                            <span className="text-sm font-medium text-secondary-900">My Balance</span>
                                            <span className="text-xs text-secondary-500 ml-2">(Available: €{wallet?.balance.toFixed(2)})</span>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN: Total */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-md shadow-sm border border-secondary-200 sticky top-8">
                            <h2 className="text-lg font-bold text-secondary-900 mb-6">Total</h2>

                            <div className="space-y-3 text-sm pb-6 border-b border-secondary-100">
                                <div className="flex justify-between text-secondary-600">
                                    <span>Order</span>
                                    <span>€{fees?.price.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-secondary-600">
                                    <span className="flex items-center gap-1">Buyer Protection <ShieldCheck size={14} className="text-primary-600" /></span>
                                    <span>€{fees?.protectionFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-secondary-600">
                                    <span>Shipping</span>
                                    <span>€{fees?.shippingCost.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center py-4 font-bold text-lg text-secondary-900">
                                <span>Total to pay</span>
                                <span>€{fees?.total.toFixed(2)}</span>
                            </div>

                            <button
                                onClick={handlePay}
                                disabled={processing || !selectedAddress || !phoneNumber}
                                className="w-full bg-[#007782] hover:bg-[#006972] text-white font-medium py-3 rounded-md transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                            >
                                {processing ? "Processing..." : "Pay now"}
                            </button>

                            <div className="mt-4 flex items-start gap-2 text-xs text-secondary-400">
                                <ShieldCheck size={16} className="flex-shrink-0" />
                                <p>Every purchase is covered by our refund policy. Funds are held until you receive the item.</p>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
