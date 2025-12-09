"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import SearchSidebar from "../SearchSidebar";

export default function Hero() {
  const router = useRouter();

  const [filters, setFilters] = useState({
    location: "",
    category: "",
    bedroom: "",
    minPrice: "",
    maxPrice: "",
  });

  const handleChange = (e: any) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e: any) => {
    e.preventDefault();
    const query = new URLSearchParams(filters);
    router.push(`/dashboard/user/properties?${query.toString()}`);
  };

  return (
    <section
      className="
        relative pt-20 pb-10 md:py-10 h-auto md:h-[90vh] w-full flex items-center justify-center 
        bg-cover bg-center bg-no-repeat
      "
      style={{ backgroundImage: "url('/office-image.avif')" }}
    >
      {/* Dark overlay with gradient */}
      <div className="absolute inset-0 bg-black/60 md:bg-gradient-to-r md:from-black/70 md:to-black/40" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-20 w-full max-w-4xl text-center px-5"
      >
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-3xl md:text-6xl font-bold text-white leading-tight drop-shadow-xl"
        >
          Discover Your  
          <span className="text-blue-400"> Dream Home</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="text-xs md:text-xl mt-4 text-gray-200 max-w-8xl mx-auto leading-6 md:leading-10 capitalize"
        >
          Explore verified listings for rent and sale at <strong className="text-blue-300">Mayor Homeland Property</strong>,  across every major city in Nigeria.
        </motion.p>

        {/* Search Panel Wrapper */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3 }}
          className="
            mt-5 md:mt-8 p-5 rounded-2xl 
            bg-white/10 backdrop-blur-xs 
            shadow-xl border border-white/20
          "
        >
          <SearchSidebar
            filters={filters}
            handleChange={handleChange}
            handleSearch={handleSearch}
          />
        </motion.div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-black/60 to-transparent" />
    </section>
  );
}
