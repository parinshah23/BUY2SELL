"use client";

import { useState, useEffect } from "react";
import { Search, Filter, MapPin } from "lucide-react";
import { motion } from "framer-motion";

interface SearchBarProps {
  onFilterChange: (filters: any) => void;
  filters?: {
    search: string;
    category: string;
    location: string;
    sort: string;
  };
}

export default function SearchBar({ onFilterChange, filters }: SearchBarProps) {
  const [search, setSearch] = useState(filters?.search || "");
  const [category, setCategory] = useState(filters?.category || "All");
  const [location, setLocation] = useState(filters?.location || "");
  const [sort, setSort] = useState(filters?.sort || "default");

  // Sync with parent filters (e.g. URL changes)
  useEffect(() => {
    if (filters) {
      setSearch(filters.search || "");
      setCategory(filters.category || "All");
      setLocation(filters.location || "");
      setSort(filters.sort || "default");
    }
  }, [filters]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    onFilterChange({ search: e.target.value, category, location, sort });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
    onFilterChange({ search, category: e.target.value, location, sort });
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
    onFilterChange({ search, category, location: e.target.value, sort });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value);
    onFilterChange({ search, category, location, sort: e.target.value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-4 rounded-2xl shadow-lg border border-secondary-100 mb-8 flex flex-col md:flex-row gap-4 items-center"
    >
      {/* 🔍 Search Input */}
      <div className="relative flex-1 w-full">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-secondary-400" />
        </div>
        <input
          type="text"
          placeholder="Search for products..."
          value={search}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-secondary-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-secondary-900 placeholder-secondary-400"
        />
      </div>

      {/* 📍 Location Input */}
      <div className="relative w-full md:w-48">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MapPin className="h-5 w-5 text-secondary-400" />
        </div>
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={handleLocationChange}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-secondary-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-secondary-900 placeholder-secondary-400"
        />
      </div>

      {/* 📂 Category Dropdown */}
      <div className="relative w-full md:w-48">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Filter className="h-5 w-5 text-secondary-400" />
        </div>
        <select
          value={category}
          onChange={handleCategoryChange}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-secondary-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-secondary-900 appearance-none bg-white cursor-pointer"
        >
          <option value="All">All Categories</option>
          <option value="Clothing">Clothing</option>
          <option value="Shoes">Shoes</option>
          <option value="Electronics">Electronics</option>
          <option value="Home">Home & Garden</option>
          <option value="Gaming">Gaming</option>
          <option value="Accessories">Accessories</option>
          <option value="Sports">Sports</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Kids">Kids</option>
          <option value="Books">Books</option>
          <option value="Vehicles">Vehicles</option>
          <option value="Hobbies">Hobbies</option>
          <option value="Other">Other</option>

        </select>
      </div>

      {/* 🔃 Sort Dropdown */}
      <div className="w-full md:w-40">
        <select
          value={sort}
          onChange={handleSortChange}
          className="w-full px-4 py-3 rounded-xl border border-secondary-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-secondary-900 appearance-none bg-white cursor-pointer"
        >
          <option value="default">Sort By</option>
          <option value="low-high">Price: Low to High</option>
          <option value="high-low">Price: High to Low</option>
          <option value="latest">Newest First</option>
        </select>
      </div>
    </motion.div>
  );
}
