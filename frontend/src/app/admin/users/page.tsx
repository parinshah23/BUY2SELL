"use client";

import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import { toast } from "sonner";
import { Trash2, Search, Shield, User as UserIcon } from "lucide-react";
import { motion } from "framer-motion";

export default function ManageUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch Users
  const fetchUsers = async () => {
    try {
      const res = await axios.get("/admin/users");
      setUsers(res.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete User
  const handleDeleteUser = async (userId: number) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;

    try {
      await axios.delete(`/admin/users/${userId}`);
      toast.success("User deleted successfully");
      setUsers(users.filter((u) => u.id !== userId));
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  // Filter Users
  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-secondary-900">Manage Users</h2>
          <p className="text-secondary-500 text-sm mt-1">
            View and manage all registered users on the platform.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-secondary-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-secondary-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary-50 border-b border-secondary-100 text-xs uppercase text-secondary-500 font-semibold tracking-wider">
                <th className="p-4">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Joined</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-secondary-400">
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-secondary-400">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-secondary-50/50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover border border-secondary-200"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center text-secondary-500">
                            <UserIcon size={20} />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-secondary-900 text-sm">{user.name}</p>
                          <p className="text-xs text-secondary-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {user.isAdmin ? (
                        <span className="inline-flex items-center gap-1 bg-primary-50 text-primary-700 px-2.5 py-1 rounded-full text-xs font-medium border border-primary-100">
                          <Shield size={12} />
                          Admin
                        </span>
                      ) : (
                        <span className="bg-secondary-100 text-secondary-600 px-2.5 py-1 rounded-full text-xs font-medium">
                          User
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-secondary-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      {!user.isAdmin && (
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
