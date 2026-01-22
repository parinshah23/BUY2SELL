"use client";

import { useState } from "react";
import Link from "next/link";
import { navCategories } from "@/lib/navCategories";
import { ChevronRight } from "lucide-react";

export default function CategoryNav() {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [activeGroup, setActiveGroup] = useState<string | null>(null);

    return (
        <div className="hidden md:block border-b border-secondary-100 bg-transparent relative">
            <div className="container-custom">
                {/* Top Level: Women, Men, Kids... */}
                <ul className="flex items-center gap-8 text-sm font-medium text-secondary-600 h-10">
                    {navCategories.map((cat) => (
                        <li
                            key={cat.name}
                            className={`h-full flex items-center cursor-pointer border-b-2 transition-colors ${activeCategory === cat.name
                                ? "border-primary-600 text-primary-600"
                                : "border-transparent hover:text-primary-600 hover:border-primary-200"
                                }`}
                            onMouseEnter={() => {
                                setActiveCategory(cat.name);
                                // Default to first group active if available
                                if (cat.groups.length > 0) setActiveGroup(cat.groups[0].name);
                            }}
                            onMouseLeave={() => {
                                // delay closing slightly or handle in container
                            }}
                        >
                            <Link href={cat.href} className="flex items-center h-full px-1">
                                {cat.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Mega Menu Dropdown */}
            {activeCategory && (
                <div
                    className="absolute left-0 right-0 bg-white border-b border-secondary-200 shadow-xl z-40 min-h-[300px]"
                    onMouseEnter={() => setActiveCategory(activeCategory)} // Keep open
                    onMouseLeave={() => setActiveCategory(null)}
                >
                    <div className="container-custom flex py-6 h-full min-h-[300px]">
                        {/* Sidebar: Clothing, Shoes, Bags... */}
                        <div className="w-64 border-r border-secondary-100 pr-4">
                            {navCategories
                                .find((c) => c.name === activeCategory)
                                ?.groups.map((group) => (
                                    <button
                                        key={group.name}
                                        className={`w-full text-left px-4 py-2.5 rounded-lg flex items-center justify-between text-sm transition-colors mb-1 ${activeGroup === group.name
                                            ? "bg-primary-50 text-primary-700 font-semibold"
                                            : "text-secondary-600 hover:bg-secondary-50"
                                            }`}
                                        onMouseEnter={() => setActiveGroup(group.name)}
                                    >
                                        <div className="flex items-center gap-3">
                                            {/* Icons could go here */}
                                            {group.name}
                                        </div>
                                        {activeGroup === group.name && <ChevronRight size={16} />}
                                    </button>
                                ))}
                        </div>

                        {/* Content Area: Subcategories list */}
                        <div className="flex-1 pl-8 grid grid-cols-4 gap-x-8 gap-y-2 content-start">
                            {navCategories
                                .find((c) => c.name === activeCategory)
                                ?.groups.find((g) => g.name === activeGroup)
                                ?.subcategories.map((sub) => (
                                    <Link
                                        key={sub.name}
                                        href={sub.href}
                                        className="text-sm text-secondary-500 hover:text-primary-600 hover:underline py-1 block"
                                        onClick={() => setActiveCategory(null)} // Close on click
                                    >
                                        {sub.name}
                                    </Link>
                                ))}

                            {(!activeGroup && navCategories.find((c) => c.name === activeCategory)?.groups.length === 0) && (
                                <p className="text-secondary-400 p-4">No categories available.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
