"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import SearchSidebar from "../SearchSidebar";

export default function Hero() {
  const router = useRouter();

  const [filters, setFilters] = useState({
    location: "",
    type: "any",
    bedrooms: "",
    minPrice: "",
    maxPrice: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Create URL params but remove empty strings and "any"
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "" && value !== "any") {
        params.append(key, value);
      }
    });

    // Push to properties page with clean query
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <section
      className="relative pt-20 pb-10 md:py-10 h-auto md:h-[90vh] w-full flex items-center justify-center 
      bg-cover bg-center"
      style={{ backgroundImage: "url('/office-image.avif')" }}
    >
      <div className="absolute inset-0 bg-black/60" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-20 w-full max-w-4xl text-center px-5"
      >
        <h1 className="text-3xl md:text-6xl font-bold text-white drop-shadow-xl">
          Discover Your <span className="text-blue-400">Dream Home</span>
        </h1>

        <p className="text-xs md:text-xl mt-4 text-gray-200">
          Explore verified listings across Nigeria.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3 }}
          className="mt-5 md:mt-8 p-5 rounded-2xl bg-white/10 backdrop-blur-sm shadow-xl"
        >
          <SearchSidebar
            filters={filters}
            handleChange={handleChange}
            handleSearch={handleSearch}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
