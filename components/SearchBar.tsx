// // components/SearchBar.tsx
// "use client";

// import { useState } from "react";
// import { useRouter } from "next/router";
// import SearchProperty from "./SearchProperty";

// export default function SearchBar() {
//     const router = useRouter();
//     const [filters, setFilters] = useState({
//         location: "",
//         category: "any",
//         bedroom: "",
//         minPrice: "",
//         maxPrice: "",
//         time: "any",
//     });

//     const handleChange = (e: any) => {
//         const { name, value } = e.target;
//         setFilters((s) => ({ ...s, [name]: value }));
//     };

//     // Inside SearchSidebar
//     const handleSearch = () => {
//         const params = new URLSearchParams();
//         if (filters.location) params.append("location", filters.location);
//         if (filters.category && filters.category !== "any") params.append("type", filters.category);
//         if (filters.bedroom) params.append("bedrooms", filters.bedroom);
//         if (filters.minPrice) params.append("minPrice", filters.minPrice);
//         if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
//         if (filters.time && filters.time !== "any") params.append("time", filters.time);

//         router.push(`/dashboard/user/properties?${params.toString()}`);
//         // remove setResults here
//     };

//     return (
//         <div className="w-full">
//             {/* Desktop/Full: show the card */}
//             <div className="hidden md:block">
//                 <SearchProperty filters={filters} handleChange={handleChange} handleSearch={handleSearch} />
//             </div>

//             {/* Mobile: a compact inline form */}
//             <div className="md:hidden">
//                 <form onSubmit={handleSearch} className="flex gap-2">
//                     <input
//                         name="location"
//                         value={filters.location}
//                         onChange={handleChange}
//                         className="flex-1 rounded p-2"
//                         placeholder="Location (e.g. Lagos)"
//                     />
//                     <select
//                         name="category"
//                         value={filters.category}
//                         onChange={handleChange}
//                         className="rounded p-2"
//                     >
//                         <option value="any">Any</option>
//                         <option value="rent">Rent</option>
//                         <option value="sale">Sale</option>
//                     </select>
//                     <button className="bg-blue-600 text-white px-3 rounded">Search</button>
//                 </form>
//             </div>
//         </div>
//     );
// }
