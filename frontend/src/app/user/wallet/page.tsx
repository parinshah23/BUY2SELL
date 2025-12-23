"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Wallet, ArrowUpRight, ArrowDownLeft, History, Loader2, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";

interface Transaction {
    id: number;
    type: string;
    amount: number;
    description: string;
    createdAt: string;
}

interface WalletData {
    balance: number;
    pending: number;
    transactions: Transaction[];
}

export default function WalletPage() {
    const [wallet, setWallet] = useState<WalletData | null>(null);
    const [loading, setLoading] = useState(true);
    const [withdrawLoading, setWithdrawLoading] = useState(false);

    const fetchWallet = async () => {
        try {
            const res = await api.get("/wallet");
            setWallet(res.data.wallet);
        } catch (error) {
            console.error("Error fetching wallet:", error);
            toast.error("Failed to load wallet data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWallet();
    }, []);

    const handleWithdraw = async () => {
        if (!wallet || wallet.balance <= 0) return;

        if (!confirm(`Confirm withdrawal of ${formatPrice(wallet.balance)}?`)) return;

        try {
            setWithdrawLoading(true);
            await api.post("/wallet/withdraw", { amount: wallet.balance });
            toast.success("Withdrawal successful!");
            fetchWallet(); // Refresh data
        } catch (error) {
            console.error("Withdrawal error:", error);
            toast.error("Withdrawal failed");
        } finally {
            setWithdrawLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-secondary-50">
                <Loader2 className="animate-spin text-primary-600" size={32} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-secondary-50 py-12">
            <div className="container-custom max-w-4xl">
                <h1 className="text-3xl font-bold text-secondary-900 mb-8 flex items-center gap-3">
                    <Wallet className="text-primary-600" /> My Wallet
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {/* Available Balance */}
                    <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-8 text-white shadow-xl shadow-primary-900/20">
                        <p className="text-primary-100 font-medium mb-2">Available Balance</p>
                        <h2 className="text-4xl font-bold mb-8">{formatPrice(wallet?.balance || 0)}</h2>

                        <button
                            onClick={handleWithdraw}
                            disabled={!wallet || wallet.balance <= 0 || withdrawLoading}
                            className="w-full bg-white text-primary-700 py-3 rounded-xl font-semibold hover:bg-primary-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {withdrawLoading ? <Loader2 className="animate-spin" size={20} /> : <ArrowUpRight size={20} />}
                            Withdraw Funds
                        </button>
                    </div>

                    {/* Pending Balance */}
                    <div className="bg-white rounded-3xl p-8 border border-secondary-100 shadow-sm">
                        <div className="flex items-start justify-between mb-8">
                            <div>
                                <p className="text-secondary-500 font-medium mb-2">Pending Clearance</p>
                                <h2 className="text-4xl font-bold text-secondary-900">{formatPrice(wallet?.pending || 0)}</h2>
                            </div>
                            <div className="bg-amber-100 p-3 rounded-xl text-amber-600">
                                <History size={24} />
                            </div>
                        </div>
                        <p className="text-sm text-secondary-400 leading-relaxed">
                            Funds from sales act as "Pending" until the buyer confirms delivery. Once confirmed, funds move to Available Balance immediately.
                        </p>
                    </div>
                </div>

                {/* Transactions */}
                <div className="bg-white rounded-3xl border border-secondary-100 overflow-hidden">
                    <div className="p-6 border-b border-secondary-100 bg-secondary-50/50">
                        <h3 className="font-bold text-lg text-secondary-900">Transaction History</h3>
                    </div>

                    {wallet?.transactions && wallet.transactions.length > 0 ? (
                        <div className="divide-y divide-secondary-100">
                            {wallet.transactions.map((tx) => (
                                <div key={tx.id} className="p-6 flex items-center justify-between hover:bg-secondary-50/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${tx.type === "DEPOSIT" || tx.type === "SALE" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                                            }`}>
                                            {tx.type === "DEPOSIT" || tx.type === "SALE" ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-secondary-900">{tx.description}</p>
                                            <p className="text-sm text-secondary-500">{new Date(tx.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <span className={`font-bold ${tx.type === "DEPOSIT" || tx.type === "SALE" ? "text-green-600" : "text-secondary-900"
                                        }`}>
                                        {tx.type === "DEPOSIT" || tx.type === "SALE" ? "+" : "-"}{formatPrice(tx.amount)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center text-secondary-500">
                            <p>No transactions yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
