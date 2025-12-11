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
    <aside
      className="
      w-full p-0 md:p-5 shadow rounded-xl
      flex flex-col space-y-5 text-black/80
      md:flex-row md:space-y-0 md:space-x-5 md:items-end
    "
    >
      {/* LOCATION */}
      <div className="w-full md:w-1/6 flex flex-col items-start">
        <label className="font-semibold text-xs md:text-sm mb-1">Location</label>
        <input
          type="text"
          className="text-sm border p-2 w-full h-8 md:h-10 rounded border-l-0 border-r-0 border-t-0 border-b-blue-500"
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
          className="border p-2 w-full rounded h-8 md:h-10 text-xs border-l-0 border-r-0 border-t-0 border-b-blue-500"
          name="type"
          value={filters.type}
          onChange={handleChange}
        >
          <option value="any" className=" text-black/80">Any</option>
          <option value="rent" className=" text-black/80">Rent</option>
          <option value="sale" className=" text-black/80">Sale</option>
          <option value="lease" className=" text-black/80">Lease</option>
          <option value="land" className=" text-black/80">Land</option>
        </select>
      </div>

      {/* BEDROOMS */}
      <div className="w-full md:w-1/6 flex flex-col items-start">
        <label className="font-semibold text-xs md:text-sm mb-1">Bedrooms</label>
        <select
          className="border p-2 w-full rounded h-8 md:h-10 text-xs border-l-0 border-r-0 border-t-0 border-b-blue-500"
          name="bedrooms"
          value={filters.bedrooms}
          onChange={handleChange}
        >
          <option value="">Any</option>
          <option value="1" className=" text-black/80">1</option>
          <option value="2" className=" text-black/80">2</option>
          <option value="3" className=" text-black/80">3</option>
          <option value="4" className=" text-black/80">4+</option>
        </select>
      </div>

      {/* PRICE RANGE */}
      <div className="w-full md:w-2/6 flex flex-col items-start">
        <label className="font-semibold text-xs md:text-sm mb-1">Price Range (₦)</label>
        <div className="flex md:flex-row gap-5 ">
          <input
            type="number"
            placeholder="Min"
            className="border p-2 w-full rounded h-8 md:h-10 text-xs border-l-0 border-r-0 border-t-0 border-b-blue-500"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleChange}
          />
          <input
            type="number"
            placeholder="Max"
            className="border p-2 w-full rounded h-8 md:h-10 text-xs border-l-0 border-r-0 border-t-0 border-b-blue-500"
            name="maxPrice"
            value={filters.maxPrice}
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
