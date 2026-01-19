"use client";

import { useState, useEffect } from "react";
import axios from "@/lib/axios";
import { formatDistanceToNow } from "date-fns";
import { Loader2, Bell, Check } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchNotifications = async () => {
        try {
            const res = await axios.get("/notifications");
            setNotifications(res.data.notifications);
        } catch (error) {
            console.error("Failed to fetch notifications");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleMarkAsRead = async (id: number, link?: string) => {
        try {
            await axios.put(`/notifications/${id}/read`);
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
            );
            if (link) {
                router.push(link);
            }
        } catch (error) {
            console.error("Failed to mark read");
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await axios.put("/notifications/read-all");
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        } catch (error) {
            console.error("Failed to mark all read");
        }
    };

    return (
        <div className="container-custom py-8 min-h-screen">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-secondary-900 flex items-center gap-2">
                    <Bell className="text-primary-600" /> My Notifications
                </h1>
                {notifications.some(n => !n.isRead) && (
                    <button
                        onClick={handleMarkAllRead}
                        className="text-sm text-primary-600 font-medium hover:underline flex items-center gap-1"
                    >
                        <Check size={16} /> Mark all read
                    </button>
                )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-secondary-100 overflow-hidden">
                {loading ? (
                    <div className="p-12 flex justify-center text-primary-600">
                        <Loader2 className="animate-spin h-8 w-8" />
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="p-12 text-center text-secondary-500">
                        <Bell className="h-12 w-12 mx-auto mb-4 text-secondary-200" />
                        <p>No notifications yet.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-secondary-100">
                        {notifications.map((n) => (
                            <div
                                key={n.id}
                                onClick={() => handleMarkAsRead(n.id, n.link)}
                                className={`p-6 hover:bg-secondary-50 transition-colors cursor-pointer flex gap-4 ${!n.isRead ? "bg-primary-50/30" : ""
                                    }`}
                            >
                                <div
                                    className={`mt-1.5 h-3 w-3 rounded-full flex-shrink-0 ${!n.isRead ? "bg-primary-500" : "bg-transparent"
                                        }`}
                                />
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <p className={`text-base ${!n.isRead ? "font-bold text-secondary-900" : "font-medium text-secondary-900"}`}>
                                            {n.title}
                                        </p>
                                        <span className="text-xs text-secondary-400 whitespace-nowrap ml-2">
                                            {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                                        </span>
                                    </div>
                                    <p className="text-secondary-600">{n.message}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
