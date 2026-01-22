"use client";

import Link from "next/link";
import {
    Shirt,
    Footprints,
    Smartphone,
    Home,
    Gamepad2,
    Watch,
    Bike,
    Music,
    Baby,
    Book,
    Car,
    Dumbbell
} from "lucide-react";

const categories = [
    { name: "Clothing", icon: Shirt, href: "/products?category=Clothing" },
    { name: "Shoes", icon: Footprints, href: "/products?category=Shoes" },
    { name: "Electronics", icon: Smartphone, href: "/products?category=Electronics" },
    { name: "Home & Garden", icon: Home, href: "/products?category=Home" },
    { name: "Gaming", icon: Gamepad2, href: "/products?category=Gaming" },
    { name: "Accessories", icon: Watch, href: "/products?category=Accessories" },
    { name: "Sports", icon: Bike, href: "/products?category=Sports" },
    { name: "Entertainment", icon: Music, href: "/products?category=Entertainment" },
    { name: "Kids", icon: Baby, href: "/products?category=Kids" },
    { name: "Books", icon: Book, href: "/products?category=Books" },
    { name: "Vehicles", icon: Car, href: "/products?category=Vehicles" },
    { name: "Hobbies", icon: Dumbbell, href: "/products?category=Hobbies" },
];

export default function Categories() {
    return (
        <section className="py-12 bg-white border-b border-secondary-100">
            <div className="container-custom">
                <h2 className="text-xl font-bold text-secondary-900 mb-8">Shop by Category</h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
                    {categories.map((category) => (
                        <Link
                            key={category.name}
                            href={category.href}
                            className="flex flex-col items-center gap-3 group relative"
                        >
                            {/* Special Badge for Key Categories */}
                            {(category.name === "Clothing" || category.name === "Shoes") && (
                                <span className="absolute -top-2 right-2 bg-primary-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10 animate-pulse shadow-md">
                                    HOT
                                </span>
                            )}

                            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm transform group-hover:-translate-y-1 
                                ${category.name === "Clothing" || category.name === "Shoes"
                                    ? "bg-primary-100 border-2 border-primary-500 text-primary-700 shadow-primary-200/50 shadow-lg scale-110"
                                    : "bg-secondary-50 border border-secondary-100 text-secondary-500 group-hover:bg-primary-50 group-hover:border-primary-200 group-hover:text-primary-600 group-hover:shadow-md"
                                }`}>
                                <category.icon size={28} className="sm:w-8 sm:h-8" />
                            </div>
                            <span className={`text-sm font-medium text-center ${category.name === "Clothing" || category.name === "Shoes" ? "text-primary-800 font-bold" : "text-secondary-700 group-hover:text-primary-700"}`}>
                                {category.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
