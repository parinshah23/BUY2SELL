"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { Upload, Loader2, X, CheckCircle, AlertCircle, FileText } from "lucide-react";
import { getImageUrl } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function KYCPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [status, setStatus] = useState<"NOT_SUBMITTED" | "PENDING" | "VERIFIED" | "REJECTED">("NOT_SUBMITTED");
    const [docs, setDocs] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/user/login");
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await axios.get("/kyc/status");
                setStatus(res.data.kycStatus);
                setDocs(res.data.docs || []);
            } catch (error) {
                console.error("Error fetching KYC status:", error);
            } finally {
                setLoading(false);
            }
        };
        if (user) fetchStatus();
    }, [user]);

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

            setDocs((prev) => [...prev, ...res.data.imageUrls]);
            toast.success("Documents uploaded successfully");
        } catch (error) {
            console.error("Upload failed:", error);
            toast.error("Failed to upload documents.");
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index: number) => {
        setDocs((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (docs.length === 0) {
            toast.error("Please upload at least one document.");
            return;
        }

        try {
            setSubmitting(true);
            const res = await axios.post("/kyc/submit", { docs });
            setStatus("PENDING");
            toast.success("KYC submitted successfully!");
        } catch (error: any) {
            console.error("Error submitting KYC:", error);
            toast.error(error.response?.data?.message || "Failed to submit KYC.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading || authLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary-600" size={40} /></div>;

    return (
        <div className="bg-secondary-50 min-h-screen py-12">
            <div className="container-custom max-w-2xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white p-8 rounded-3xl shadow-xl border border-secondary-100"
                >
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-secondary-900 mb-2">Identity Verification</h1>
                        <p className="text-secondary-500">
                            To ensure safety on our platform, we require sellers to verify their identity.
                        </p>
                    </div>

                    {/* Status Indicators */}
                    <div className="flex justify-center mb-8">
                        {status === "VERIFIED" && (
                            <div className="flex flex-col items-center text-green-600 bg-green-50 px-6 py-4 rounded-xl border border-green-100">
                                <CheckCircle size={48} className="mb-2" />
                                <h3 className="font-bold text-lg">Verified</h3>
                                <p className="text-sm">You are a verified seller!</p>
                            </div>
                        )}
                        {status === "PENDING" && (
                            <div className="flex flex-col items-center text-yellow-600 bg-yellow-50 px-6 py-4 rounded-xl border border-yellow-100">
                                <Loader2 size={48} className="mb-2 animate-spin" />
                                <h3 className="font-bold text-lg">Verification Pending</h3>
                                <p className="text-sm">Our team is reviewing your documents.</p>
                            </div>
                        )}
                        {status === "REJECTED" && (
                            <div className="flex flex-col items-center text-red-600 bg-red-50 px-6 py-4 rounded-xl border border-red-100">
                                <AlertCircle size={48} className="mb-2" />
                                <h3 className="font-bold text-lg">Verification Rejected</h3>
                                <p className="text-sm">Please upload clear documents and try again.</p>
                            </div>
                        )}
                        {status === "NOT_SUBMITTED" && (
                            <div className="flex flex-col items-center text-secondary-600 bg-secondary-50 px-6 py-4 rounded-xl border border-secondary-100">
                                <FileText size={48} className="mb-2" />
                                <h3 className="font-bold text-lg">Not Submitted</h3>
                                <p className="text-sm">Please upload your ID proof below.</p>
                            </div>
                        )}
                    </div>

                    {/* Upload Section */}
                    {(status === "NOT_SUBMITTED" || status === "REJECTED") && (
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">Upload ID Documents (Passport, Driving License, etc.)</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                                    {docs.map((doc, index) => (
                                        <div key={index} className="relative group aspect-[3/2] rounded-xl overflow-hidden border border-secondary-200 bg-secondary-50">
                                            <img
                                                src={getImageUrl(doc)}
                                                alt={`Document ${index + 1}`}
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
                                    <label className="border-2 border-dashed border-secondary-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-all aspect-[3/2]">
                                        {uploading ? (
                                            <Loader2 className="animate-spin text-primary-500" />
                                        ) : (
                                            <>
                                                <Upload className="text-secondary-400 mb-2" />
                                                <span className="text-xs text-secondary-500 font-medium">Upload File</span>
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
                                <p className="text-xs text-secondary-500">Supported formats: JPG, PNG. Max 5MB per file.</p>
                            </div>

                            <button
                                onClick={handleSubmit}
                                disabled={submitting || docs.length === 0}
                                className="w-full bg-primary-600 text-white px-6 py-4 rounded-xl font-semibold hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {submitting ? (
                                    <Loader2 className="animate-spin h-5 w-5" />
                                ) : (
                                    "Submit for Verification"
                                )}
                            </button>
                        </div>
                    )}

                    {status === "PENDING" && (
                        <div className="text-center text-secondary-500 text-sm mt-4">
                            We will notify you via email once your verification is complete.
                        </div>
                    )}

                </motion.div>
            </div>
        </div>
    );
}
