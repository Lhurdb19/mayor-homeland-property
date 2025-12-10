"use client";

import { useState } from "react";
import SearchProperty from "@/components/SearchProperty";

export default function SearchPage() {
  // ✅ Safe initial state
  const [filters, setFilters] = useState({
    location: "",
    category: "",
    bedroom: "",
    minPrice: "",
    maxPrice: "",
    time: "any",
  });

  // ✅ Safe handler
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value ?? "",
    }));
  };

  // ✅ Search handler
  const handleSearch = (e: any) => {
    e.preventDefault();
    console.log("Searching with:", filters);
  };

  return (
    <div className="max-w-4xl mx-auto py-10">
      <SearchProperty
        filters={filters}
        handleChange={handleChange}
        handleSearch={handleSearch}
      />
    </div>
  );
}
