"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, ShoppingBag, FileText } from "lucide-react";
import "@/styles/NewAdminLayout.css";

export default function NewAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navLinks = [
    { href: "/admin", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { href: "/admin/users", label: "Manage Users", icon: <Users size={20} /> },
    { href: "/admin/products", label: "Manage Products", icon: <ShoppingBag size={20} /> },
    { href: "/admin/kyc", label: "KYC Verification", icon: <FileText size={20} /> },
    { href: "/admin/reports", label: "Reports", icon: <FileText size={20} /> },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2 className="admin-sidebar-header">Admin Panel</h2>
        <nav className="admin-sidebar-nav">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`admin-sidebar-link ${pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href)) ? "admin-sidebar-link-active" : ""
                }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}
