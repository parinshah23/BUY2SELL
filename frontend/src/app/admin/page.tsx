"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { Users, ShoppingBag, DollarSign, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/stats");
        setStats(res.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: <Users size={24} className="text-blue-600" />,
      bg: "bg-blue-100",
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: <ShoppingBag size={24} className="text-purple-600" />,
      bg: "bg-purple-100",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: <TrendingUp size={24} className="text-green-600" />,
      bg: "bg-green-100",
    },
    {
      title: "Total Revenue",
      value: `€${stats.totalRevenue.toLocaleString()}`,
      icon: <DollarSign size={24} className="text-yellow-600" />,
      bg: "bg-yellow-100",
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-secondary-900 mb-6">Dashboard Overview</h2>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-white rounded-xl shadow-sm animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-secondary-100 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${card.bg}`}>
                {card.icon}
              </div>
              <div>
                <p className="text-sm text-secondary-500 font-medium">{card.title}</p>
                <p className="text-2xl font-bold text-secondary-900">{card.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
