// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { Skeleton } from "@/components/ui/skeleton";

// interface LocationItem {
//   name: string;
//   image: string;
//   propertiesCount: number;
// }

// export default function TopLocations() {
//   const [locations, setLocations] = useState<LocationItem[] | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchLocations = async () => {
//       try {
//         const res = await fetch("/api/admin/locations");
//         const data = await res.json();
//         setLocations(data);
//       } catch (err) {
//         console.error("Failed to fetch locations:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchLocations();
//   }, []);

//   return (
//     <section className="py-16">
//       <div className="max-w-6xl mx-auto px-4">
//         <h2 className="text-3xl font-semibold mb-10">🔹 Top Locations</h2>

//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
//           {(loading ? Array.from({ length: 8 }) : locations)?.map((item, idx) => (
//             <div
//               key={item?.name || idx}
//               className="relative w-full h-56 rounded-xl overflow-hidden shadow-md group cursor-pointer"
//             >
//               {loading ? (
//                 <Skeleton className="w-full h-full" />
//               ) : (
//                 <Link href={`/properties?location=${encodeURIComponent(item!.name)}`}>
//                   <div className="w-full h-full relative">
//                     <Image
//                       src={item!.image}
//                       alt={item!.name}
//                       fill
//                       className="object-cover group-hover:scale-110 transition duration-500"
//                     />
//                     <div className="absolute inset-0 bg-black/40"></div>
//                     <h3 className="absolute bottom-4 left-4 text-white font-semibold text-lg drop-shadow-md">
//                       {item!.name} ({item!.propertiesCount})
//                     </h3>
//                   </div>
//                 </Link>
//               )}
//             </div>
//           ))}

//         </div>
//       </div>
//     </section>
//   );
// }
