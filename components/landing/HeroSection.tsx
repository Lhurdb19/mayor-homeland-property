"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import SearchSidebar from "../SearchSidebar";
import { FaHandPointRight } from "react-icons/fa";

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

    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "" && value !== "any") {
        params.append(key, value);
      }
    });

    router.push(`/properties?${params.toString()}`);
  };

  const handleLocationClick = (city: string) => {
    router.push(`/properties?location=${encodeURIComponent(city)}`);
  };

  const topLocations = [
    { name: "Lekki", map: "/maps/lekki.jpg" },
    { name: "Ajah", map: "/maps/ajah.jpg" },
    { name: "Ikeja", map: "/maps/ikeja.jpg" },
    { name: "Yaba", map: "/maps/yaba.jpg" },
    { name: "Abuja", map: "/maps/abuja.jpg" },
    { name: "Ibadan", map: "/maps/ibadan.jpg" },
  ];

  return (
    <section
      className="relative min-h-[90vh] px-4 md:px-20 pt-10 md:pt-20 bg-cover bg-center flex flex-col items-center justify-between"
      style={{ backgroundImage: "url('/office-image.avif')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/50 to-black/80" />

      <div className="relative z-10 w-full max-w-8xl mx-auto py-10 grid grid-cols-1 lg:grid-cols-4 gap-10 items-center">
        <motion.aside
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="hidden lg:flex flex-col justify-start items-start mt-10 gap-4 relative"
        >
          <h3 className="text-lg font-bold text-white">
            Top Locations
          </h3>

          <ul className="space-y-3">
            {topLocations.map((city) => (
              <li
                key={city.name}
                className="relative group flex items-center gap-3 cursor-pointer font-medium text-white hover:text-blue-500 transition"
                onClick={() => handleLocationClick(city.name)}
              >
                <FaHandPointRight className="w-4 h-4 text-blue-500" />
                {city.name}
              </li>
            ))}
          </ul>
        </motion.aside>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="lg:col-span-3 text-center lg:text-left"
        >
          <h1 className="text-3xl md:text-6xl font-extrabold text-white leading-tight">
            Find Your Perfect Home <br />
            <span className="text-blue-500">Anywhere in Nigeria</span>
          </h1>

          <p className="mt-4 text-sm md:text-xl text-gray-200 max-w-2xl ">
            Discover verified properties for rent, sale, and investment
            transparent pricing, trusted listings, zero stress.
          </p>

          {/* QUICK FILTER TABS */}
          {/* <div className="flex justify-center lg:justify-start gap-3 mt-6 flex-wrap">
            {["any", "rent", "sale", "land"].map((item) => (
              <button
                key={item}
                onClick={() => setFilters({ ...filters, type: item })}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition
                  ${
                    filters.type === item
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-white/20 text-white hover:bg-white/30"
                  }`}
              >
                {item === "any" ? "All" : item.toUpperCase()}
              </button>
            ))}
          </div> */}

          </motion.div>
      </div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="w-full mb-10 md:p-4 rounded-xl bottom-0
           bg-none md:bg-white backdrop-blur-xl shadow-2xl"
          >
            <SearchSidebar
              filters={filters}
              handleChange={handleChange}
              handleSearch={handleSearch}
            />
          </motion.div>
    </section>
  );
}
