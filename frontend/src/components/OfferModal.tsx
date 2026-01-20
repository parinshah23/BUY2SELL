import { useState, useEffect } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { X } from "lucide-react";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";

interface OfferModalProps {
    productId: number;
    productPrice: number;
    productTitle: string;
    productImage?: string;
    isOpen: boolean;
    onClose: () => void;
    isSeller?: boolean;
    buyerId?: number;
}

export default function OfferModal({ productId, productPrice, productTitle, productImage, isOpen, onClose }: OfferModalProps) {
    const [amount, setAmount] = useState<string>("");
    const [activePreset, setActivePreset] = useState<number | null>(null); // 1 = 10%, 2 = 20%, 3 = Custom
    const [loading, setLoading] = useState(false);

    // Initial load - reset
    useEffect(() => {
        if (isOpen) {
            setAmount("");
            setActivePreset(null);
        }
    }, [isOpen]);

    const handlePreset = (percentage: number) => {
        const discount = productPrice * percentage;
        const newPrice = productPrice - discount;
        setAmount(newPrice.toFixed(2));
        setActivePreset(percentage === 0.1 ? 1 : 2);
    };

    const handleCustomFocus = () => {
        setActivePreset(3);
    };

    const handleSubmit = async () => {
        const offerAmount = parseFloat(amount);
        if (!offerAmount || offerAmount <= 0) {
            toast.error("Please enter a valid price");
            return;
        }
        if (offerAmount >= productPrice) {
            toast.error("Offer must be lower than the item price");
            return;
        }

        setLoading(true);
        try {
            await api.post("/offers", { productId, amount: offerAmount });
            toast.success("Offer sent!");
            onClose();
        } catch (error: any) {
            console.error("Offer error:", error);
            toast.error(error.response?.data?.message || "Failed to send offer");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    // Protection Fee Calculation: 0.70 fixed + 5% of item price
    // Note: The image says "$23.53 incl. Buyer Protection fee" for a $21.74 item.
    // 21.74 + 0.70 + (21.74 * 0.05) = 21.74 + 0.70 + 1.087 = 23.527 -> 23.53. Matches Vinted logic.
    const currentPrice = parseFloat(amount || "0");
    const protectionFee = 0.70 + (currentPrice * 0.05);
    const totalWithFee = currentPrice + protectionFee;

    // Prices for buttons
    const price10 = (productPrice * 0.9).toFixed(2);
    const price20 = (productPrice * 0.8).toFixed(2);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            {/* Modal Container */}
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b border-secondary-100">
                    <h2 className="text-xl font-bold text-secondary-900">Make an offer</h2>
                    <button onClick={onClose} className="p-1 text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    {/* Item Info */}
                    <div className="flex gap-4 mb-6">
                        <div className="w-16 h-16 relative rounded-xl overflow-hidden bg-secondary-100 flex-shrink-0 border border-secondary-200">
                            {productImage ? (
                                <Image
                                    src={getImageUrl(productImage)}
                                    alt={productTitle}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            ) : (
                                <div className="w-full h-full bg-secondary-200" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <h3 className="font-semibold text-secondary-900 truncate text-base mb-1">{productTitle}</h3>
                            <p className="text-secondary-500 text-sm">Item price: <span className="font-semibold text-secondary-900">€{productPrice.toFixed(2)}</span></p>
                        </div>
                    </div>

                    {/* Presets */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        <button
                            onClick={() => handlePreset(0.1)}
                            className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden group ${activePreset === 1
                                    ? "border-primary-500 bg-primary-50 ring-1 ring-primary-500"
                                    : "border-secondary-200 hover:border-secondary-300 hover:bg-secondary-50"
                                }`}
                        >
                            <div className={`font-bold ${activePreset === 1 ? "text-primary-700" : "text-secondary-900"}`}>€{price10}</div>
                            <div className={`text-xs font-medium ${activePreset === 1 ? "text-primary-600" : "text-green-600"}`}>10% off</div>
                        </button>

                        <button
                            onClick={() => handlePreset(0.2)}
                            className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden group ${activePreset === 2
                                    ? "border-primary-500 bg-primary-50 ring-1 ring-primary-500"
                                    : "border-secondary-200 hover:border-secondary-300 hover:bg-secondary-50"
                                }`}
                        >
                            <div className={`font-bold ${activePreset === 2 ? "text-primary-700" : "text-secondary-900"}`}>€{price20}</div>
                            <div className={`text-xs font-medium ${activePreset === 2 ? "text-primary-600" : "text-green-600"}`}>20% off</div>
                        </button>

                        <button
                            onClick={handleCustomFocus}
                            className={`p-3 rounded-xl border text-left transition-all group ${activePreset === 3
                                    ? "border-primary-500 bg-primary-50 ring-1 ring-primary-500"
                                    : "border-secondary-200 hover:border-secondary-300 hover:bg-secondary-50"
                                }`}
                        >
                            <div className={`font-bold ${activePreset === 3 ? "text-primary-700" : "text-secondary-900"}`}>Custom</div>
                            <div className={`text-xs font-medium ${activePreset === 3 ? "text-primary-600" : "text-secondary-500"}`}>Set price</div>
                        </button>
                    </div>

                    {/* Input Field */}
                    <div className="relative mb-3 group">
                        <div className={`absolute left-0 bottom-0 w-full h-0.5 transition-colors ${activePreset === 3 || amount ? "bg-primary-500" : "bg-secondary-200 group-hover:bg-secondary-300"}`}></div>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => {
                                setAmount(e.target.value);
                                setActivePreset(3);
                            }}
                            onFocus={handleCustomFocus}
                            className="w-full text-3xl font-bold p-2 bg-transparent border-none focus:ring-0 text-secondary-900 placeholder-secondary-200"
                            placeholder={`€${productPrice.toFixed(2)}`}
                        />
                        <span className="absolute top-1/2 -translate-y-1/2 right-2 text-secondary-400 font-medium">EUR</span>
                    </div>

                    {/* Fee Text */}
                    <div className="flex justify-between items-center text-sm mb-8">
                        <span className="text-secondary-500">Total with buyer protection</span>
                        <span className="font-semibold text-secondary-900">
                            {amount && !isNaN(parseFloat(amount))
                                ? `€${totalWithFee.toFixed(2)}`
                                : "—"}
                        </span>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !amount}
                        className="w-full py-4 rounded-xl bg-primary-600 text-white font-bold text-lg hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none active:scale-[0.98]"
                    >
                        {loading ? "Sending..." : "Send Offer"}
                    </button>

                    {/* Limit Text */}
                    <p className="text-xs text-secondary-400 text-center mt-4">
                        You have 25 offers remaining today.
                    </p>

                </div>
            </div>
        </div>
    );
}
