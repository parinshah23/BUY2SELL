"use client";

import { motion } from "framer-motion";
import { MapPin, Users, ShieldCheck, Globe, Award, Leaf } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
    return (
        <div className="bg-secondary-50 min-h-screen pt-24 pb-20">
            {/* 🌍 Hero Section */}
            <section className="container-custom mb-20">
                <div className="text-center max-w-3xl mx-auto">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6"
                    >
                        Connecting Europe's <span className="text-primary-600">Buyers & Sellers</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-secondary-600 leading-relaxed"
                    >
                        Buy2Sell is the premier marketplace for the European community. From Berlin to Barcelona, Paris to Prague, we bridge the gap between local communities and cross-border trade, making it safe, easy, and sustainable to buy and sell pre-loved goods.
                    </motion.p>
                </div>
            </section>

            {/* 📊 Stats Section */}
            <section className="bg-white py-16 border-y border-secondary-200 mb-20">
                <div className="container-custom grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {[
                        { label: "Active Users", value: "1M+", icon: Users },
                        { label: "Countries", value: "20+", icon: Globe },
                        { label: "Daily Listings", value: "50k+", icon: MapPin },
                        { label: "Trust Score", value: "4.9/5", icon: ShieldCheck },
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="flex flex-col items-center"
                        >
                            <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mb-4">
                                <stat.icon size={24} />
                            </div>
                            <h3 className="text-3xl font-bold text-secondary-900 mb-1">{stat.value}</h3>
                            <p className="text-secondary-500 font-medium">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* 🌟 Our Values */}
            <section className="container-custom mb-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-secondary-900">Our Core Values</h2>
                    <p className="text-secondary-500 mt-2">What drives us to build a better marketplace</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            title: "Trust & Safety",
                            desc: "We prioritize your safety with verified profiles, secure messaging, and a dedicated support team across Europe.",
                            icon: ShieldCheck,
                            color: "bg-blue-50 text-blue-600"
                        },
                        {
                            title: "Sustainability",
                            desc: "By promoting the circular economy, we help reduce waste and carbon footprint. Every item reused is a win for the planet.",
                            icon: Leaf,
                            color: "bg-green-50 text-green-600"
                        },
                        {
                            title: "Community First",
                            desc: "We believe in the power of local communities. Our platform fosters connections between neighbors and nations alike.",
                            icon: Users,
                            color: "bg-purple-50 text-purple-600"
                        }
                    ].map((value, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="bg-white p-8 rounded-2xl border border-secondary-100 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className={`w-14 h-14 ${value.color} rounded-xl flex items-center justify-center mb-6`}>
                                <value.icon size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-secondary-900 mb-3">{value.title}</h3>
                            <p className="text-secondary-600 leading-relaxed">{value.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* 🇪🇺 European Presence */}
            <section className="bg-secondary-900 text-white py-20 rounded-3xl container-custom relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-900/20 to-transparent pointer-events-none" />

                <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium text-primary-200 mb-6">
                        <Globe size={16} />
                        <span>Pan-European Network</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Built for Europe's Diverse Market</h2>
                    <p className="text-secondary-300 text-lg mb-8 leading-relaxed">
                        We understand the nuances of the European market. From handling multiple currencies to respecting local trading customs, Buy2Sell is designed to feel local, wherever you are.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link
                            href="/products"
                            className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-full font-semibold transition-all"
                        >
                            Start Exploring
                        </Link>
                        <Link
                            href="/user/register"
                            className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full font-semibold backdrop-blur-sm transition-all"
                        >
                            Join the Community
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
