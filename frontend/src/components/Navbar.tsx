"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Heart, User, LogOut, ShoppingBag, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useWishlist } from "@/context/WishlistContext";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const { user, logout } = useAuth();
  const { wishlist } = useWishlist();
  const router = useRouter();
  const pathname = usePathname();

  // Handle scroll effect with hide/show on scroll direction
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Update scrolled state for styling
      setScrolled(currentScrollY > 20);

      // Hide navbar when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down & past threshold
        setVisible(false);
      } else {
        // Scrolling up or at top
        setVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About", href: "/about" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm py-3"
          : "bg-transparent py-5"
        } ${visible ? "translate-y-0" : "-translate-y-full"}`}
    >
      <div className="container-custom flex justify-between items-center">
        {/* 🌐 Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group"
        >
          <div className="bg-primary-600 text-white p-2 rounded-xl group-hover:rotate-3 transition-transform duration-300">
            <ShoppingBag size={24} />
          </div>
          <span className={`text-2xl font-bold tracking-tight ${scrolled ? 'text-secondary-900' : 'text-secondary-900'}`}>
            Buy2Sell
          </span>
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

              <div className="flex items-center gap-3 pl-4 border-l border-secondary-200">
                <div className="text-right hidden lg:block">
                  <p className="text-sm font-semibold text-secondary-900 leading-none">
                    {user?.name?.split(" ")[0] ?? "User"}
                  </p>
                  <Link href="/user/my-products" className="text-xs text-primary-600 hover:underline block">
                    My Dashboard
                  </Link>
                  <Link href="/user/profile" className="text-xs text-secondary-500 hover:text-primary-600 hover:underline block mt-1">
                    Edit Profile
                  </Link>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-secondary-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
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
            className="md:hidden bg-white border-t border-secondary-100 overflow-hidden"
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
    </header>
  );
}
