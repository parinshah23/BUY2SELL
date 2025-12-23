"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "@/lib/axios";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { Send, User, MessageCircle, ArrowLeft, Image as ImageIcon, MoreVertical, Ban, AlertTriangle, X } from "lucide-react";
import { io } from "socket.io-client";
import { toast } from "sonner";

export default function ChatPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentChatId = searchParams.get("id");
    const { user } = useAuth();

    const [chats, setChats] = useState<any[]>([]);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [isTyping, setIsTyping] = useState(false);
    const [typingUser, setTypingUser] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const socket = useRef<any>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // ... (Socket Code Omitted for brevity, unchanged) ...
    // ✅ Initialize Socket.io
    useEffect(() => {
        const socketUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") || "http://localhost:5000";
        socket.current = io(socketUrl);

        socket.current.on("receive_message", (data: any) => {
            if (String(data.chatId) === String(currentChatId)) {
                setMessages((prev) => [...prev, data]);
                setTypingUser(null);
                axios.put(`/chats/${currentChatId}/read`);
            }
            setChats((prevChats) => {
                const existingChatIndex = prevChats.findIndex(c => c.id === Number(data.chatId));
                if (existingChatIndex === -1) return prevChats;
                const updatedChats = [...prevChats];
                const isCurrentChat = String(data.chatId) === String(currentChatId);
                const updatedChat = {
                    ...updatedChats[existingChatIndex],
                    messages: [data],
                    unreadCount: isCurrentChat ? 0 : (updatedChats[existingChatIndex].unreadCount || 0) + 1,
                    updatedAt: new Date().toISOString()
                };
                updatedChats.splice(existingChatIndex, 1);
                updatedChats.unshift(updatedChat);
                return updatedChats;
            });
        });

        socket.current.on("typing", (data: any) => {
            if (String(data.room) === String(currentChatId) && data.userId !== user?.id) {
                setTypingUser(data.name);
            }
        });

        socket.current.on("stop_typing", (data: any) => {
            if (String(data.room) === String(currentChatId)) {
                setTypingUser(null);
            }
        });

        return () => {
            socket.current.disconnect();
        };
    }, [currentChatId, user?.id]);

    // ... (Other UseEffects Unchanged) ...
    useEffect(() => {
        if (currentChatId) {
            axios.put(`/chats/${currentChatId}/read`);
            setChats(prev => prev.map(c =>
                c.id === Number(currentChatId) ? { ...c, unreadCount: 0 } : c
            ));
        }
    }, [currentChatId]);

    useEffect(() => {
        if (currentChatId && socket.current) {
            socket.current.emit("join_room", currentChatId);
            setTypingUser(null);
        }
    }, [currentChatId]);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const res = await axios.get("/chats");
                setChats(res.data.chats);
            } catch (error) {
                console.error("Error fetching chats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchChats();
    }, []);

    useEffect(() => {
        if (!currentChatId) return;
        const fetchMessages = async () => {
            try {
                const res = await axios.get(`/chats/${currentChatId}`);
                setMessages(res.data.messages);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };
        fetchMessages();
    }, [currentChatId]);

    const isFirstLoad = useRef(true);
    useEffect(() => { isFirstLoad.current = true; }, [currentChatId]);

    useEffect(() => {
        if (messages.length === 0 || !containerRef.current) return;
        const container = containerRef.current;
        if (isFirstLoad.current) {
            container.scrollTop = container.scrollHeight;
            isFirstLoad.current = false;
        } else {
            const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;
            if (isNearBottom) {
                setTimeout(() => {
                    container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
                }, 100);
            }
        }
    }, [messages, typingUser]);


    // ✅ Handle Typing
    const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewMessage(e.target.value);
        if (!socket.current || !currentChatId) return;
        if (!isTyping) {
            setIsTyping(true);
            socket.current.emit("typing", { room: currentChatId, userId: user?.id, name: user?.name });
        }
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            socket.current.emit("stop_typing", { room: currentChatId });
        }, 2000);
    };

    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // ✅ Handle Image Selection
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        const file = e.target.files[0];
        setSelectedImage(file);
        setPreviewUrl(URL.createObjectURL(file));

        // Reset input so same file can be selected again if needed
        e.target.value = "";
    };

    // ✅ Remove Selected Image
    const removeImage = () => {
        setSelectedImage(null);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
    };

    // ✅ Send Message (Text + Optional Image)
    const sendMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if ((!newMessage.trim() && !selectedImage) || !currentChatId || uploading) return;

        // Clear typing indicator
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        setIsTyping(false);
        socket.current?.emit("stop_typing", { room: currentChatId });

        let imageUrl = "";

        try {
            setUploading(true);

            // 1. Upload Image if selected
            if (selectedImage) {
                const formData = new FormData();
                formData.append("image", selectedImage);

                const uploadRes = await axios.post("/upload", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                imageUrl = uploadRes.data.imageUrl;
            }

            // 2. Send Message to Backend
            const res = await axios.post(`/chats/${currentChatId}/messages`, {
                content: newMessage,
                image: imageUrl || undefined,
            });

            // 3. Clear Input & State
            setNewMessage("");
            removeImage();

            // 4. Update UI Optimistically
            const savedMessage = res.data.data;
            const messageWithSender = {
                ...savedMessage,
                sender: { id: user?.id, name: user?.name }
            };

            setMessages((prev) => [...prev, messageWithSender]);

            setChats((prevChats) => {
                const existingChatIndex = prevChats.findIndex(c => c.id === Number(currentChatId));
                if (existingChatIndex === -1) return prevChats;
                const updatedChats = [...prevChats];
                const updatedChat = {
                    ...updatedChats[existingChatIndex],
                    messages: [messageWithSender],
                    updatedAt: new Date().toISOString()
                };
                updatedChats.splice(existingChatIndex, 1);
                updatedChats.unshift(updatedChat);
                return updatedChats;
            });

            // 5. Emit Socket Event
            socket.current.emit("send_message", {
                room: currentChatId,
                ...messageWithSender
            });

        } catch (error) {
            console.error("Error sending message:", error);
            toast.error("Failed to send message");
        } finally {
            setUploading(false);
        }
    };

    // ✅ Block User
    const handleBlockUser = async (userId: number) => {
        if (!confirm("Are you sure you want to block this user?")) return;
        try {
            await axios.post(`/users/${userId}/block`);
            toast.success("User blocked");
            setShowMenu(false);
        } catch (error) {
            toast.error("Failed to block user");
        }
    };

    // ✅ Report User
    const handleReportUser = async (userId: number) => {
        const reason = prompt("Please enter a reason for reporting:");
        if (!reason) return;

        try {
            await axios.post(`/users/${userId}/report`, { reason });
            toast.success("User reported");
            setShowMenu(false);
        } catch (error) {
            toast.error("Failed to report user");
        }
    };

    const handleSelectChat = (chatId: number) => {
        router.push(`/user/chat?id=${chatId}`);
    };

    const activeChat = chats.find((c) => c.id === Number(currentChatId));
    const activeChatOtherUser = activeChat ? (activeChat.buyerId === user?.id ? activeChat.seller : activeChat.buyer) : null;

    return (
        <div className="bg-secondary-50 min-h-screen py-8">
            <div className="container-custom h-[calc(100vh-100px)]">
                <div className="bg-white rounded-3xl shadow-xl border border-secondary-100 overflow-hidden h-full flex flex-col md:flex-row">

                    {/* 📜 Sidebar: Chat List */}
                    <div className={`w-full md:w-1/3 border-r border-secondary-100 flex flex-col ${currentChatId ? 'hidden md:flex' : 'flex'}`}>
                        <div className="p-6 border-b border-secondary-100 bg-secondary-50">
                            <h2 className="text-xl font-bold text-secondary-900 flex items-center gap-2">
                                <MessageCircle className="text-primary-600" />
                                Messages
                            </h2>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            {loading ? (
                                <div className="text-center text-secondary-400 py-10">Loading chats...</div>
                            ) : chats.length === 0 ? (
                                <div className="text-center text-secondary-400 py-10">No conversations yet.</div>
                            ) : (
                                chats.map((chat) => {
                                    const otherUser = chat.buyerId === user?.id ? chat.seller : chat.buyer;
                                    const isActive = chat.id === Number(currentChatId);
                                    return (
                                        <button
                                            key={chat.id}
                                            onClick={() => handleSelectChat(chat.id)}
                                            className={`w-full p-4 rounded-xl flex items-start gap-3 transition-all text-left ${isActive ? "bg-primary-50 border border-primary-100" : "hover:bg-secondary-50 border border-transparent"}`}
                                        >
                                            <div className="w-10 h-10 bg-secondary-200 rounded-full flex items-center justify-center text-secondary-600 font-bold flex-shrink-0">
                                                {otherUser.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <h3 className="font-semibold text-secondary-900 truncate">{otherUser.name}</h3>
                                                    <span className="text-xs text-secondary-400 whitespace-nowrap">
                                                        {new Date(chat.updatedAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-secondary-500 truncate font-medium">
                                                    {chat.product.title}
                                                </p>
                                                <div className="flex justify-between items-center mt-1">
                                                    <p className={`text-xs truncate ${isActive ? "text-primary-700" : "text-secondary-400"}`}>
                                                        {chat.messages[0]?.image ? "📷 Image" : (chat.messages[0]?.content || "No messages yet")}
                                                    </p>
                                                    {chat.unreadCount > 0 && (
                                                        <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg shadow-red-500/30">
                                                            {chat.unreadCount}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* 💬 Main Chat Area */}
                    <div className={`w-full md:w-2/3 flex flex-col ${!currentChatId ? 'hidden md:flex' : 'flex'}`}>
                        {currentChatId ? (
                            <>
                                {/* Header */}
                                <div className="p-4 border-b border-secondary-100 flex items-center justify-between bg-white shadow-sm z-10 relative">
                                    <div className="flex items-center gap-4">
                                        <button onClick={() => router.push("/user/chat")} className="md:hidden p-2 hover:bg-secondary-50 rounded-full">
                                            <ArrowLeft size={20} />
                                        </button>
                                        {activeChat && (
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold">
                                                    {activeChatOtherUser?.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-secondary-900">{activeChatOtherUser?.name}</h3>
                                                    <p className="text-xs text-secondary-500 flex items-center gap-1">
                                                        Product: <span className="font-medium text-primary-600">{activeChat.product.title}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Menu */}
                                    <div className="relative">
                                        <button onClick={() => setShowMenu(!showMenu)} className="p-2 text-secondary-500 hover:bg-secondary-50 rounded-full transition-colors">
                                            <MoreVertical size={20} />
                                        </button>
                                        <AnimatePresence>
                                            {showMenu && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    className="absolute right-0 top-12 w-48 bg-white rounded-xl shadow-xl border border-secondary-100 p-1 z-50 origin-top-right"
                                                >
                                                    <button
                                                        onClick={() => handleReportUser(activeChatOtherUser.id)}
                                                        className="w-full text-left px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 rounded-lg flex items-center gap-2"
                                                    >
                                                        <AlertTriangle size={16} /> Report User
                                                    </button>
                                                    <button
                                                        onClick={() => handleBlockUser(activeChatOtherUser.id)}
                                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
                                                    >
                                                        <Ban size={16} /> Block User
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div ref={containerRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-secondary-50/50">
                                    {messages.map((msg) => {
                                        const isMe = msg.senderId === user?.id;
                                        return (
                                            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                                                <div className={`max-w-[75%] p-4 rounded-2xl shadow-sm ${isMe ? "bg-primary-600 text-white rounded-tr-none" : "bg-white text-secondary-800 border border-secondary-100 rounded-tl-none"}`}>
                                                    {msg.image && (
                                                        <img src={msg.image} alt="Attachment" className="w-full h-auto rounded-lg mb-2 object-cover max-h-[300px]" />
                                                    )}
                                                    {msg.content && <p className="text-sm whitespace-pre-wrap">{msg.content}</p>}
                                                    <span className={`text-[10px] mt-1 block ${isMe ? "text-primary-200" : "text-secondary-400"}`}>
                                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <AnimatePresence>
                                        {typingUser && (
                                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="flex justify-start">
                                                <div className="bg-white px-4 py-2 rounded-2xl rounded-tl-none border border-secondary-100 shadow-sm flex items-center gap-1">
                                                    <span className="text-xs text-secondary-400 mr-2">{typingUser} is typing</span>
                                                    <div className="w-1.5 h-1.5 bg-secondary-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                                    <div className="w-1.5 h-1.5 bg-secondary-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                                    <div className="w-1.5 h-1.5 bg-secondary-400 rounded-full animate-bounce"></div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input */}
                                <div className="p-4 bg-white border-t border-secondary-100">
                                    {/* Image Preview */}
                                    {previewUrl && (
                                        <div className="mb-3 relative inline-block">
                                            <img src={previewUrl} alt="Preview" className="h-20 w-auto rounded-lg border border-secondary-200 object-cover" />
                                            <button
                                                onClick={removeImage}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-sm hover:bg-red-600 transition-colors"
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    )}

                                    <form onSubmit={sendMessage} className="flex gap-3 items-center">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleImageSelect}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={uploading}
                                            className="p-3 rounded-xl border border-secondary-200 text-secondary-500 hover:bg-secondary-50 transition-colors disabled:opacity-50"
                                            title="Attach Image"
                                        >
                                            <ImageIcon size={20} />
                                        </button>

                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={handleTyping}
                                            placeholder="Type a message..."
                                            className="flex-1 px-4 py-3 rounded-xl border border-secondary-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                                        />
                                        <button
                                            type="submit"
                                            disabled={(!newMessage.trim() && !selectedImage) || uploading}
                                            className="bg-primary-600 text-white p-3 rounded-xl hover:bg-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-500/20"
                                        >
                                            {uploading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Send size={20} />}
                                        </button>
                                    </form>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-secondary-400 bg-secondary-50/30">
                                <div className="w-20 h-20 bg-secondary-100 rounded-full flex items-center justify-center mb-4">
                                    <MessageCircle size={40} className="text-secondary-300" />
                                </div>
                                <p className="text-lg font-medium">Select a conversation to start chatting</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
