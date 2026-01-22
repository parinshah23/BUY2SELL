"use client";

import { useState, useEffect } from "react";
import { Bell, Check, Loader2 } from "lucide-react";
import axios from "@/lib/axios";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuthContext } from "@/context/AuthContext";

export default function NotificationCenter() {
    const { user } = useAuthContext();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const fetchNotifications = async () => {
        if (!user) return; // Prevent fetch if not logged in
        try {
            const res = await axios.get("/notifications");
            setNotifications(res.data.notifications);
            setUnreadCount(res.data.unreadCount);
        } catch (error) {
            console.error("Failed to fetch notifications");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchNotifications();
            // Poll every 30 seconds
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const handleMarkAsRead = async (id: number, link?: string) => {
        try {
            await axios.put(`/notifications/${id}/read`);
            setUnreadCount((prev) => Math.max(0, prev - 1));
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
            );
            if (link) {
                setIsOpen(false);
                router.push(link);
            }
        } catch (error) {
            console.error("Failed to mark read");
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await axios.put("/notifications/read-all");
            setUnreadCount(0);
            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        } catch (error) {
            console.error("Failed to mark all read");
        }
    };

    return (
        <div className="relative group">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-secondary-600 hover:text-primary-600 transition-colors rounded-full hover:bg-secondary-100 focus:outline-none"
                title="Notifications"
            >
                <Bell size={22} className={unreadCount > 0 ? "fill-primary-600 text-primary-600" : ""} />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full ring-2 ring-white">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop to close */}
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="absolute right-0 top-full mt-2 w-80 md:w-96 bg-white rounded-xl shadow-xl border border-secondary-100 overflow-hidden z-50 origin-top-right"
                        >
                            <div className="p-4 border-b border-secondary-100 flex justify-between items-center bg-secondary-50">
                                <h3 className="font-bold text-secondary-900">Notifications</h3>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={handleMarkAllRead}
                                        className="text-xs text-primary-600 font-medium hover:underline flex items-center gap-1"
                                    >
                                        <Check size={12} /> Mark all read
                                    </button>
                                )}
                            </div>

                            <div className="max-h-[70vh] overflow-y-auto">
                                {loading ? (
                                    <div className="p-8 flex justify-center text-primary-600"><Loader2 className="animate-spin" /></div>
                                ) : notifications.length === 0 ? (
                                    <div className="p-8 text-center text-secondary-500 text-sm">No notifications yet.</div>
                                ) : (
                                    notifications.map((n) => (
                                        <div
                                            key={n.id}
                                            onClick={() => handleMarkAsRead(n.id, n.link)}
                                            className={`p-4 border-b border-secondary-50 hover:bg-secondary-50 transition-colors cursor-pointer flex gap-3 ${!n.isRead ? 'bg-primary-50/50' : ''}`}
                                        >
                                            <div className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${!n.isRead ? 'bg-primary-500' : 'bg-transparent'}`} />
                                            <div className="flex-1">
                                                <p className={`text-sm ${!n.isRead ? 'font-semibold text-secondary-900' : 'text-secondary-700'}`}>
                                                    {n.title}
                                                </p>
                                                <p className="text-xs text-secondary-500 mt-1">{n.message}</p>
                                                <p className="text-[10px] text-secondary-400 mt-2">
                                                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
