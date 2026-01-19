"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { Loader2, Check, X, FileText, Eye } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";

export default function AdminKYCPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<any>(null); // For modal

    const fetchPendingKYC = async () => {
        try {
            const res = await axios.get("/admin/kyc/pending");
            setUsers(res.data.users);
        } catch (error) {
            console.error("Error fetching KYC requests:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingKYC();
    }, []);

    const handleApprove = async (id: number) => {
        try {
            await axios.post(`/admin/kyc/${id}/approve`);
            toast.success("User verified successfully");
            setUsers(users.filter(u => u.id !== id));
            setSelectedUser(null);
        } catch (error) {
            toast.error("Failed to approve user");
        }
    };

    const handleReject = async (id: number) => {
        try {
            await axios.post(`/admin/kyc/${id}/reject`);
            toast.success("User KYC rejected");
            setUsers(users.filter(u => u.id !== id));
            setSelectedUser(null);
        } catch (error) {
            toast.error("Failed to reject user");
        }
    };

    if (loading) return <Loader2 className="animate-spin text-primary-600 m-8" />;

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-secondary-100">
            <h1 className="text-2xl font-bold text-secondary-900 mb-6">Pending KYC Requests</h1>

            {users.length === 0 ? (
                <p className="text-secondary-500">No pending verification requests.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-secondary-100 text-secondary-500 text-sm">
                                <th className="py-4 px-4">User</th>
                                <th className="py-4 px-4">Email</th>
                                <th className="py-4 px-4">Date Submitted</th>
                                <th className="py-4 px-4">Documents</th>
                                <th className="py-4 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-b border-secondary-50 hover:bg-secondary-50 transition-colors">
                                    <td className="py-4 px-4 font-medium text-secondary-900">{user.name}</td>
                                    <td className="py-4 px-4 text-secondary-600">{user.email}</td>
                                    <td className="py-4 px-4 text-secondary-500">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="py-4 px-4">
                                        <button
                                            onClick={() => setSelectedUser(user)}
                                            className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm"
                                        >
                                            <Eye size={16} /> View Docs ({user.kycDocs.length})
                                        </button>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleApprove(user.id)}
                                                className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                                                title="Approve"
                                            >
                                                <Check size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleReject(user.id)}
                                                className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                                title="Reject"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Document Viewer Modal */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-secondary-100 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold text-secondary-900">Documents: {selectedUser.name}</h3>
                                <p className="text-sm text-secondary-500">{selectedUser.email}</p>
                            </div>
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="p-2 hover:bg-secondary-100 rounded-full transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 bg-secondary-50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {selectedUser.kycDocs.map((doc: string, i: number) => (
                                    <div key={i} className="rounded-xl overflow-hidden border border-secondary-200 bg-white">
                                        <Image
                                            src={getImageUrl(doc)}
                                            alt={`Doc ${i + 1}`}
                                            width={600}
                                            height={400}
                                            className="w-full h-auto object-contain"
                                            unoptimized
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 border-t border-secondary-100 flex justify-end gap-4 bg-white">
                            <button
                                onClick={() => handleReject(selectedUser.id)}
                                className="px-6 py-2.5 rounded-xl border border-red-200 text-red-600 font-semibold hover:bg-red-50 transition-colors"
                            >
                                Reject
                            </button>
                            <button
                                onClick={() => handleApprove(selectedUser.id)}
                                className="px-6 py-2.5 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors shadow-lg shadow-green-500/20"
                            >
                                Approve Verification
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
