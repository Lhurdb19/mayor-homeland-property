"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Filters = {
  location?: string;
  type?: string;
  bedrooms?: string;
  minPrice?: string;
  maxPrice?: string;
};

export default function SearchSidebar({ initialFilters }: { initialFilters?: Filters }) {
  const router = useRouter();
  const [filters, setFilters] = useState<Filters>({
    location: initialFilters?.location || "",
    type: initialFilters?.type || "any",
    bedrooms: initialFilters?.bedrooms || "",
    minPrice: initialFilters?.minPrice || "",
    maxPrice: initialFilters?.maxPrice || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (filters.location) params.append("location", filters.location);
    if (filters.type && filters.type !== "any") params.append("type", filters.type);
    if (filters.bedrooms) params.append("bedrooms", filters.bedrooms);
    if (filters.minPrice) params.append("minPrice", filters.minPrice);
    if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);

    router.push(`/dashboard/user/properties?${params.toString()}`);
  };

    return (
  <aside
    className="
      w-full p-0 md:p-5 shadow rounded-xl
      flex flex-col space-y-5
      md:flex-row md:space-y-0 md:space-x-5 md:items-end
    "
  >
    {/* LOCATION */}
    <div className="w-full md:w-1/6 flex flex-col items-start">
      <label className="font-semibold text-xs md:text-sm mb-1">Location</label>
      <input
        type="text"
        className="border p-2 w-full h-8 md:h-10 rounded"
        placeholder="e.g Lagos"
        name="location"
        value={filters.location}
        onChange={handleChange}
      />
    </div>

    {/* PROPERTY TYPE */}
    <div className="w-full md:w-1/6 flex flex-col items-start">
      <label className="font-semibold text-xs md:text-sm mb-1">Property Type</label>
      <select
        className="border p-2 w-full rounded h-8 md:h-10 text-xs"
        name="type"
        value={filters.type}
        onChange={handleChange}
      >
        <option value="any">Any</option>
        <option value="rent">Rent</option>
        <option value="sale">Sale</option>
        <option value="lease">Lease</option>
        <option value="land">Land</option>
      </select>
    </div>

    {/* BEDROOMS */}
    <div className="w-full md:w-1/6 flex flex-col items-start">
      <label className="font-semibold text-xs md:text-sm mb-1">Bedrooms</label>
      <select
        className="border p-2 w-full rounded h-8 md:h-10 text-xs"
        name="bedrooms"
        value={filters.bedrooms}
        onChange={handleChange}
      >
        <option value="">Any</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4+</option>
      </select>
    </div>

    {/* PRICE RANGE */}
    <div className="w-full md:w-2/6 flex flex-col items-start">
      <label className="font-semibold text-xs md:text-sm mb-1">Price Range (₦)</label>
      <div className="flex md:flex-row gap-5 ">
        <input
          type="number"
          placeholder="Min"
          className="border p-2 w-full rounded h-8 md:h-10 text-xs"
          name="minPrice"
          value={filters.minPrice || ""}
          onChange={handleChange}
        />
        <input
          type="number"
          placeholder="Max"
          className="border p-2 w-full rounded h-8 md:h-10 text-xs"
          name="maxPrice"
          value={filters.maxPrice || ""}
          onChange={handleChange}
        />
      </div>
    </div>

    {/* SEARCH BUTTON */}
    <button
      className="
        bg-blue-600 text-white rounded font-medium
        w-full md:w-1/6 py-3 h-8 md:h-10 text-xs items-center flex justify-center
      "
      onClick={handleSearch}
    >
      Search
    </button>
  </aside>
);
}
