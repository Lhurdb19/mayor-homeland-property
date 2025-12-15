"use client";

type Filters = {
  location: string;
  type: string;
  bedrooms: string;
  minPrice: string;
  maxPrice: string;
};

interface SearchSidebarProps {
  filters: Filters;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleSearch: (e: React.FormEvent) => void;
}

export default function SearchSidebar({
  filters,
  handleChange,
  handleSearch,
}: SearchSidebarProps) {
  return (
    <aside className="w-full grid grid-cols-1 md:grid-cols-6 gap-4 items-end text-black/80">
      {/* LOCATION */}
      <div className="flex flex-col">
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={filters.location}
          onChange={handleChange}
          className="h-9 px-4 rounded border border-gray-200 outline-none text-sm 
          bg-white md:bg-transparent placeholder:text-gray-400 md:placeholder:text-black"
        />
      </div>

      {/* TYPE */}
      <div className="flex flex-col">
        <select
          name="type"
          value={filters.type}
          onChange={handleChange}
          className="h-9 px-4 rounded border border-gray-200 outline-none text-sm
          bg-white md:bg-transparent placeholder:text-gray-400 md:placeholder:text-black"
        >
          <option value="any">Property Type</option>
          <option value="rent">Rent</option>
          <option value="sale">Sale</option>
          <option value="lease">Lease</option>
          <option value="land">Land</option>
        </select>
      </div>

      {/* BEDROOMS */}
      <div className="flex flex-col">
        <select
          name="bedrooms"
          value={filters.bedrooms}
          onChange={handleChange}
          className="h-9 px-4 rounded border border-gray-200 outline-none text-sm
          bg-white md:bg-transparent placeholder:text-gray-400 md:placeholder:text-black"
        >
          <option value="">Bedrooms</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4+</option>
        </select>
      </div>

      {/* MIN PRICE */}
      <div className="flex flex-col">
        <input
          type="number"
          name="minPrice"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={handleChange}
          className="h-9 px-4 rounded border border-gray-200 outline-none text-sm
          bg-white md:bg-transparent placeholder:text-gray-400 md:placeholder:text-black"
        />
      </div>

      {/* MAX PRICE */}
      <div className="flex flex-col">
        <input
          type="number"
          name="maxPrice"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={handleChange}
          className="h-9 px-4 rounded border border-gray-200 outline-none text-sm
          bg-white md:bg-transparent placeholder:text-gray-400 md:placeholder:text-black"
        />
      </div>

      {/* SEARCH BUTTON */}
      <button
        onClick={handleSearch}
        className="h-9 rounded bg-blue-600 text-white font-semibold text-[13px]
        hover:bg-blue-700 transition-all shadow-lg flex items-center justify-center p-2"
      >
        Search
      </button>
    </aside>
  );
}
