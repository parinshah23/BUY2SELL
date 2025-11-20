"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-secondary-900 text-white pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* 🏢 Company Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white tracking-tight">Buy2Sell</h3>
            <p className="text-secondary-400 text-sm leading-relaxed">
              The most trusted marketplace for buying and selling high-quality products.
              Join our community today and experience seamless transactions.
            </p>
            <div className="flex space-x-4 pt-2">
              <SocialIcon icon={<Facebook size={18} />} href="#" />
              <SocialIcon icon={<Twitter size={18} />} href="#" />
              <SocialIcon icon={<Instagram size={18} />} href="#" />
              <SocialIcon icon={<Linkedin size={18} />} href="#" />
            </div>
          </div>

          {/* 🔗 Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3 text-sm text-secondary-400">
              <li><FooterLink href="/">Home</FooterLink></li>
              <li><FooterLink href="/products">Browse Products</FooterLink></li>
              <li><FooterLink href="/about">About Us</FooterLink></li>
              <li><FooterLink href="/contact">Contact Support</FooterLink></li>
              <li><FooterLink href="/blog">Blog & News</FooterLink></li>
            </ul>
          </div>

          {/* ⚖️ Legal & Support */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Support</h4>
            <ul className="space-y-3 text-sm text-secondary-400">
              <li><FooterLink href="/help">Help Center</FooterLink></li>
              <li><FooterLink href="/terms">Terms of Service</FooterLink></li>
              <li><FooterLink href="/privacy">Privacy Policy</FooterLink></li>
              <li><FooterLink href="/faq">FAQs</FooterLink></li>
              <li><FooterLink href="/shipping">Shipping Info</FooterLink></li>
            </ul>
          </div>

          {/* 📧 Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Stay Updated</h4>
            <p className="text-secondary-400 text-sm mb-4">
              Subscribe to our newsletter for the latest updates and exclusive offers.
            </p>
            <form className="flex flex-col space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-secondary-800 border border-secondary-700 text-white px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm placeholder:text-secondary-500"
              />
              <button
                type="submit"
                className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-secondary-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-secondary-500 text-sm">
            &copy; {new Date().getFullYear()} Buy2Sell Marketplace. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-secondary-500 text-sm">
            <div className="flex items-center gap-2">
              <Mail size={14} />
              <span>support@buy2sell.eu</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={14} />
              <span>Berlin, Germany</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ icon, href }: { icon: React.ReactNode; href: string }) {
  return (
    <a
      href={href}
      className="w-8 h-8 flex items-center justify-center bg-secondary-800 text-secondary-400 rounded-full hover:bg-primary-600 hover:text-white transition-all duration-300"
    >
      {icon}
    </a>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="hover:text-primary-400 transition-colors duration-200 flex items-center gap-2"
    >
      <span className="w-1 h-1 bg-secondary-600 rounded-full opacity-0 hover:opacity-100 transition-opacity" />
      {children}
    </Link>
  );
}
