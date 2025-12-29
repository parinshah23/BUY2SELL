"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Heart, User, LogOut, ShoppingBag, MessageCircle, Package, Wallet, MapPin } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useWishlist } from "@/context/WishlistContext";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { wishlist } = useWishlist();
  const router = useRouter();
  const pathname = usePathname();

  const { scrollY } = useScroll();

  // Transform values for the navbar container
  // Increased range to 500 to slow down the transition
  const width = useTransform(scrollY, [0, 500], ["100%", "50%"]);
  const marginTop = useTransform(scrollY, [0, 500], ["0px", "20px"]);
  const borderRadius = useTransform(scrollY, [0, 500], ["0px", "100px"]);
  const backgroundColor = useTransform(
    scrollY,
    [0, 500],
    ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.8)"]
  );
  const backdropFilter = useTransform(scrollY, [0, 500], ["blur(0px)", "blur(10px)"]);
  const border = useTransform(
    scrollY,
    [0, 500],
    ["1px solid rgba(0,0,0,0)", "1px solid rgba(0,0,0,0.1)"]
  );
  const paddingY = useTransform(scrollY, [0, 500], ["20px", "12px"]);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About", href: "/about" },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <motion.header
        style={{
          width,
          marginTop,
          borderRadius,
          backgroundColor,
          backdropFilter,
          border,
          paddingTop: paddingY,
          paddingBottom: paddingY,
        }}
        className="pointer-events-auto transition-shadow duration-300"
      >
        <div className="container-custom flex justify-between items-center w-full">
          {/* 🌐 Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
          >
            <img
              src="/logo(1).png"
              alt="Buy2Sell Logo"
              className="h-26 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* 🧭 Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors relative group ${pathname === link.href
                  ? "text-primary-600"
                  : "text-secondary-600 hover:text-primary-600"
                  }`}
              >
                {link.name}
                {pathname === link.href && (
                  <motion.div
                    layoutId="underline"
                    className="absolute left-0 right-0 -bottom-1 h-0.5 bg-primary-600 rounded-full"
                  />
                )}
              </Link>
            ))}
            {user && (
              <Link
                href="/user/orders"
                className={`text-sm font-medium transition-colors relative group ${pathname === "/user/orders"
                  ? "text-primary-600"
                  : "text-secondary-600 hover:text-primary-600"
                  }`}
              >
                My Orders
                {pathname === "/user/orders" && (
                  <motion.div
                    layoutId="underline"
                    className="absolute left-0 right-0 -bottom-1 h-0.5 bg-primary-600 rounded-full"
                  />
                )}
              </Link>
            )}
          </nav>

          {/* 🔐 Auth + Wishlist */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {/* 💬 Chat Icon */}
                <button
                  onClick={() => router.push("/user/chat")}
                  className="relative p-2 text-secondary-600 hover:text-primary-600 transition-colors rounded-full hover:bg-secondary-100"
                  title="Messages"
                >
                  <MessageCircle size={22} />
                </button>

                {/* ❤️ Wishlist Icon */}
                <button
                  onClick={() => router.push("/user/wishlist")}
                  className="relative p-2 text-secondary-600 hover:text-accent-500 transition-colors rounded-full hover:bg-secondary-100"
                  title="Wishlist"
                >
                  <Heart
                    size={22}
                    className={`${wishlist.length > 0 ? "fill-accent-500 text-accent-500" : ""}`}
                  />
                  {wishlist.length > 0 && (
                    <span className="absolute top-0 right-0 bg-accent-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full ring-2 ring-white">
                      {wishlist.length}
                    </span>
                  )}
                </button>

                <div className="relative ml-4 group">
                  <button
                    onClick={() => router.push("/user/profile")}
                    className="flex items-center gap-2 focus:outline-none"
                  >
                    <div className="text-right hidden lg:block">
                      <p className="text-sm font-semibold text-secondary-900 leading-none">
                        {user?.name?.split(" ")[0] ?? "User"}
                      </p>
                      <p className="text-[10px] text-secondary-500 font-medium mt-0.5">My Account</p>
                    </div>
                    <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold text-lg border-2 border-white shadow-sm group-hover:bg-primary-600 group-hover:text-white transition-colors">
                      {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                  </button>

                  {/* Dropdown Menu (Group Hover) */}
                  <div className="absolute right-0 top-full pt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
                    <div className="bg-white rounded-xl shadow-xl border border-secondary-100 overflow-hidden p-2">
                      <div className="px-4 py-3 border-b border-secondary-100 mb-2">
                        <p className="text-sm font-bold text-secondary-900 truncate">{user.name}</p>
                        <p className="text-xs text-secondary-500 truncate">{user.email}</p>
                      </div>

                      <Link href="/user/my-products" className="flex items-center gap-2 px-4 py-2 text-sm text-secondary-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-colors">
                        <Package size={16} /> Dashboard
                      </Link>
                      <Link href="/user/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-secondary-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-colors">
                        <User size={16} /> Edit Profile
                      </Link>
                      <Link href="/user/orders" className="flex items-center gap-2 px-4 py-2 text-sm text-secondary-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-colors">
                        <ShoppingBag size={16} /> My Orders
                      </Link>
                      <Link href="/user/wallet" className="flex items-center gap-2 px-4 py-2 text-sm text-secondary-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-colors">
                        <Wallet size={16} /> My Wallet
                      </Link>
                      <Link href="/user/addresses" className="flex items-center gap-2 px-4 py-2 text-sm text-secondary-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-colors">
                        <MapPin size={16} /> My Addresses
                      </Link>

                      <div className="h-px bg-secondary-100 my-2" />

                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/user/login"
                  className="text-sm font-semibold text-secondary-600 hover:text-primary-600 px-4 py-2 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/user/register"
                  className="text-sm font-semibold bg-primary-600 text-white px-5 py-2.5 rounded-full hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 transform hover:-translate-y-0.5"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* 📱 Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-secondary-700 hover:bg-secondary-100 rounded-full transition-colors"
            onClick={toggleMenu}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* 📱 Mobile Dropdown */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-secondary-100 overflow-hidden w-full absolute top-full left-0 right-0 rounded-b-3xl shadow-xl"
            >
              <div className="container-custom py-6 flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`text-lg font-medium ${pathname === link.href ? "text-primary-600" : "text-secondary-600"
                      }`}
                  >
                    {link.name}
                  </Link>
                ))}

                <div className="h-px bg-secondary-100 my-2" />

                {user ? (
                  <div className="space-y-4">
                    <Link
                      href="/user/my-products"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 text-secondary-700 font-medium"
                    >
                      <User size={20} />
                      My Dashboard
                    </Link>
                    <Link
                      href="/user/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 text-secondary-700 font-medium"
                    >
                      <User size={20} />
                      Edit Profile
                    </Link>
                    <Link
                      href="/user/orders"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 text-secondary-700 font-medium"
                    >
                      <Package size={20} />
                      My Orders
                    </Link>
                    <Link
                      href="/user/wallet"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 text-secondary-700 font-medium"
                    >
                      <p className="font-bold">$</p>
                      My Wallet
                    </Link>
                    <Link
                      href="/user/addresses"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 text-secondary-700 font-medium"
                    >
                      <MapPin size={20} />
                      My Addresses
                    </Link>
                    <Link
                      href="/user/chat"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 text-secondary-700 font-medium"
                    >
                      <MessageCircle size={20} />
                      Messages
                    </Link>
                    <button
                      onClick={() => {
                        router.push("/user/wishlist");
                        setMenuOpen(false);
                      }}
                      className="flex items-center gap-3 text-secondary-700 font-medium"
                    >
                      <Heart
                        size={20}
                        className={`${wishlist.length > 0 ? "fill-accent-500 text-accent-500" : ""}`}
                      />
                      Wishlist ({wishlist.length})
                    </button>

                    <div className="flex items-center justify-between pt-2 border-t border-secondary-100">
                      <span className="text-secondary-900 font-semibold">
                        {user.name}
                      </span>
                      <button
                        onClick={() => {
                          logout();
                          setMenuOpen(false);
                        }}
                        className="text-red-600 font-medium text-sm"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link
                      href="/user/login"
                      onClick={() => setMenuOpen(false)}
                      className="text-center text-secondary-700 font-semibold py-2 border border-secondary-200 rounded-full"
                    >
                      Login
                    </Link>
                    <Link
                      href="/user/register"
                      onClick={() => setMenuOpen(false)}
                      className="text-center bg-primary-600 text-white font-semibold py-2 rounded-full shadow-md"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </div>
  );
}
