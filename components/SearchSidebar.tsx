"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

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
        <Input
          type="text"
          name="location"
          placeholder="Location"
          value={filters.location}
          onChange={handleChange}
          className="h-9 text-sm w-full border-b-1.5 rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0"
        />
      </div>

      {/* TYPE */}
      <div className="flex flex-col">
        <Select
          name="type"
          value={filters.type}
          onValueChange={(value) =>
            handleChange({ target: { name: "type", value } } as any)
          }
        >
          <SelectTrigger className="h-9 text-sm w-full border-b-1.5 rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0">
            <SelectValue placeholder="Property Type" />
          </SelectTrigger>
          <SelectContent className="bg-white text-black/70 w-full">
            <SelectItem value="any">Any</SelectItem>
            <SelectItem value="rent">Rent</SelectItem>
            <SelectItem value="sale">Sale</SelectItem>
            <SelectItem value="lease">Lease</SelectItem>
            <SelectItem value="land">Land</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* BEDROOMS */}
      <div className="flex flex-col">
        <Select
          name="bedrooms"
          value={filters.bedrooms}
          onValueChange={(value) =>
            handleChange({ target: { name: "bedrooms", value } } as any)
          }
        >
          <SelectTrigger className="h-9 text-sm w-full border-b-1.5 rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0">
            <SelectValue placeholder="Bedrooms" />
          </SelectTrigger>
          <SelectContent className="bg-white text-black/70 w-full">
            <SelectItem value="any">Any</SelectItem>
            <SelectItem value="1">1</SelectItem>
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="3">3</SelectItem>
            <SelectItem value="4">4+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* MIN PRICE */}
      <div className="flex flex-col">
        <Input
          type="number"
          name="minPrice"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={handleChange}
          className="h-9 text-sm w-full border-b-1.5 rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0"
        />
      </div>

      {/* MAX PRICE */}
      <div className="flex flex-col">
        <Input
          type="number"
          name="maxPrice"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={handleChange}
          className="h-9 text-sm w-full border-b-1.5 rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0"
        />
      </div>

      {/* SEARCH BUTTON */}
      <Button
        onClick={handleSearch}
        className="h-9 text-[13px] font-semibold bg-blue-600"
      >
        Search
      </Button>
    </aside>
  );
}
