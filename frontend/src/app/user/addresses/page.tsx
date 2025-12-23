"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { MapPin, Plus, Trash2, CheckCircle, Home, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface Address {
    id: number;
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    isDefault: boolean;
}

export default function AddressesPage() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "",
        isDefault: false,
    });

    // Fetch Addresses
    const fetchAddresses = async () => {
        try {
            const res = await api.get("/address");
            setAddresses(res.data.addresses);
        } catch (error) {
            console.error("Error fetching addresses:", error);
            toast.error("Failed to load addresses");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    // Handle Input Change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    // Submit New Address
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await api.post("/address", formData);
            toast.success("Address added successfully");
            setFormData({
                name: "",
                street: "",
                city: "",
                state: "",
                zip: "",
                country: "",
                isDefault: false,
            });
            setShowForm(false);
            fetchAddresses();
        } catch (error) {
            console.error("Error adding address:", error);
            toast.error("Failed to add address");
        } finally {
            setSubmitting(false);
        }
    };

    // Delete Address
    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this address?")) return;
        try {
            await api.delete(`/address/${id}`);
            toast.success("Address deleted");
            setAddresses(prev => prev.filter(a => a.id !== id));
        } catch (error) {
            console.error("Error deleting address:", error);
            toast.error("Failed to delete address");
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
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-secondary-900 flex items-center gap-3">
                        <MapPin className="text-primary-600" /> Address Book
                    </h1>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-primary-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-primary-700 transition-colors flex items-center gap-2"
                    >
                        {showForm ? "Cancel" : <><Plus size={20} /> Add Address</>}
                    </button>
                </div>

                {/* Add Address Form */}
                {showForm && (
                    <div className="bg-white p-6 rounded-2xl shadow-md border border-secondary-100 mb-8 animate-in fade-in slide-in-from-top-4">
                        <h2 className="text-lg font-bold text-secondary-900 mb-4">Add New Address</h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-secondary-700 mb-1">Full Name</label>
                                <input required name="name" value={formData.name} onChange={handleChange} className="w-full p-3 rounded-lg border border-secondary-200 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="John Doe" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-1">Street Address</label>
                                <input required name="street" value={formData.street} onChange={handleChange} className="w-full p-3 rounded-lg border border-secondary-200 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="123 Main St" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-1">City</label>
                                <input required name="city" value={formData.city} onChange={handleChange} className="w-full p-3 rounded-lg border border-secondary-200 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="New York" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-1">State / Province</label>
                                <input name="state" value={formData.state} onChange={handleChange} className="w-full p-3 rounded-lg border border-secondary-200 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="NY" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-1">ZIP / Postal Code</label>
                                <input required name="zip" value={formData.zip} onChange={handleChange} className="w-full p-3 rounded-lg border border-secondary-200 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="10001" />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-secondary-700 mb-1">Country</label>
                                <input required name="country" value={formData.country} onChange={handleChange} className="w-full p-3 rounded-lg border border-secondary-200 focus:ring-2 focus:ring-primary-500 outline-none" placeholder="United States" />
                            </div>
                            <div className="col-span-2 flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="isDefault"
                                    id="isDefault"
                                    checked={formData.isDefault}
                                    onChange={handleChange}
                                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                                />
                                <label htmlFor="isDefault" className="text-secondary-700">Set as default shipping address</label>
                            </div>
                            <div className="col-span-2 mt-4">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition-colors disabled:opacity-50"
                                >
                                    {submitting ? "Saving..." : "Save Address"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Address List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((address) => (
                        <div key={address.id} className={`bg-white p-6 rounded-2xl border ${address.isDefault ? "border-primary-500 ring-1 ring-primary-500" : "border-secondary-100"} shadow-sm relative group`}>
                            {address.isDefault && (
                                <div className="absolute top-4 right-4 text-primary-600 bg-primary-50 px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
                                    <CheckCircle size={14} /> Default
                                </div>
                            )}

                            <div className="flex items-start gap-4 mb-4">
                                <div className="bg-secondary-100 p-3 rounded-full text-secondary-600">
                                    <Home size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-secondary-900">{address.name}</h3>
                                    <p className="text-secondary-500 text-sm">{address.street}</p>
                                    <p className="text-secondary-500 text-sm">{address.city}, {address.state} {address.zip}</p>
                                    <p className="text-secondary-500 text-sm font-medium mt-1">{address.country}</p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-secondary-100 flex justify-end">
                                <button
                                    onClick={() => handleDelete(address.id)}
                                    className="text-red-500 hover:text-red-700 text-sm font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 size={16} /> Remove
                                </button>
                            </div>
                        </div>
                    ))}

                    {addresses.length === 0 && !showForm && (
                        <div className="col-span-full py-12 text-center text-secondary-500 bg-white rounded-2xl border border-secondary-100 border-dashed">
                            <MapPin size={48} className="mx-auto mb-4 text-secondary-300" />
                            <p className="text-lg font-medium">No addresses saved yet.</p>
                            <p className="text-sm">Add an address to speed up checkout.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
