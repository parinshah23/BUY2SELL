import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import "@/styles/theme.css";

import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageWrapper from "@/components/PageWrapper";
import { WishlistProvider } from "@/context/WishlistContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Buy2Sell Marketplace",
  description: "A modern marketplace built with Next.js + Prisma + Neon",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body suppressHydrationWarning={true} className="font-sans bg-secondary-50 text-secondary-900">
        <AuthProvider>
          <WishlistProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <PageWrapper>{children}</PageWrapper>
              <Footer />
            </div>
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}