"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Camera, Save, User, Trash2 } from "lucide-react";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import { toast } from "sonner";

export default function ProfilePage() {
    const { user, login, updateUser } = useAuth(); // login is used to update local user state
    const router = useRouter();

    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [avatar, setAvatar] = useState("");
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setBio(user.bio || "");
            setAvatar(user.avatar || "");
        }
    }, [user]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file); // The backend expects "image" field

        try {
            setUploading(true);
            const token = localStorage.getItem("token");
            const res = await axios.post("/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.data.imageUrl) {
                setAvatar(res.data.imageUrl);
                toast.success("Profile picture uploaded!");
            }
        } catch (error) {
            console.error("Error uploading image:", error);
            toast.error("Failed to upload image");
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const res = await axios.put(
                "/users/profile",
                { name, bio, avatar },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Update local user state (if useAuth supports it, otherwise reload or re-fetch)
            // Assuming login() can be used to set user data or we just rely on re-fetch
            updateUser(res.data.user);
            toast.success("Profile updated successfully!");

            // Update the auth context with new data if possible, or just let the local state show it
            // window.location.reload(); // Removed to prevent toast from disappearing

        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-secondary-50 py-12">
                <div className="container-custom max-w-2xl">
                    <div className="bg-white rounded-3xl shadow-sm border border-secondary-100 p-8">
                        <h1 className="text-3xl font-bold text-secondary-900 mb-8">Edit Profile</h1>

                        {/* Avatar Section */}
                        {/* Avatar Section */}
                        <div className="flex flex-col items-center mb-8">
                            <div className="relative w-32 h-32 mb-4">
                                <div className="w-full h-full rounded-full overflow-hidden border-4 border-white shadow-lg bg-secondary-100 flex items-center justify-center">
                                    {avatar ? (
                                        <Image
                                            src={getImageUrl(avatar)}
                                            alt="Profile"
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    ) : (
                                        <User size={48} className="text-secondary-400" />
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <label className="cursor-pointer px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg text-sm font-medium hover:bg-secondary-200 transition-colors flex items-center gap-2">
                                    <Camera size={16} />
                                    Change Photo
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageUpload}
                                        disabled={uploading}
                                    />
                                </label>
                                {avatar && (
                                    <button
                                        onClick={() => setAvatar("")}
                                        className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors flex items-center gap-2"
                                    >
                                        <Trash2 size={16} />
                                        Remove
                                    </button>
                                )}
                            </div>
                            {uploading && <p className="text-sm text-primary-600 mt-2">Uploading...</p>}
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                                    placeholder="Enter your name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">
                                    Bio
                                </label>
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all resize-none"
                                    placeholder="Tell us about yourself..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={user?.email || ""}
                                    disabled
                                    className="w-full px-4 py-3 rounded-xl border border-secondary-200 bg-secondary-50 text-secondary-500 cursor-not-allowed"
                                />
                                <p className="text-xs text-secondary-400 mt-1">Email cannot be changed.</p>
                            </div>

                            <button
                                onClick={handleSave}
                                disabled={loading || uploading}
                                className="w-full bg-primary-600 text-white py-4 rounded-xl font-semibold hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    "Saving..."
                                ) : (
                                    <>
                                        <Save size={20} /> Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
