// "use client";

// import { useEffect, useState } from "react";
// import AdminLayout from "@/components/admin/AdminLayout";
// import Image from "next/image";
// import { toast } from "sonner";
// import { Button } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";
// import axios from "axios";

// interface LocationItem {
//   _id: string;
//   name: string;
//   image: string;
//   propertiesCount: number;
// }

// export default function TopLocationsAdmin() {
//   const [locations, setLocations] = useState<LocationItem[]>([]);
//   const [allLocations, setAllLocations] = useState<string[]>([]);
//   const [loading, setLoading] = useState(true);

//   const [editId, setEditId] = useState<string | null>(null);
//   const [newName, setNewName] = useState("");
//   const [newImage, setNewImage] = useState<File | null>(null);
//   const [selectedLocation, setSelectedLocation] = useState("");

//   // Fetch top locations
//   const fetchTopLocations = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get("/api/admin/toplocations");
//       setLocations(res.data);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to fetch top locations");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch all property locations
//   const fetchAllLocations = async () => {
//     try {
//       const res = await axios.get("/api/admin/locations");
//       setAllLocations(res.data);
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to fetch property locations");
//     }
//   };

//   useEffect(() => {
//     fetchTopLocations();
//     fetchAllLocations();
//   }, []);

//   // Filter dropdown to show only locations not already in top locations
//   const availableLocations = allLocations.filter(
//     (loc) => !locations.some((top) => top.name === loc)
//   );

//   // Edit handler
//   const handleEdit = (loc: LocationItem) => {
//     setEditId(loc._id);
//     setNewName(loc.name);
//     setNewImage(null);
//   };

//   // Save handler
//   const handleSave = async (id: string) => {
//     try {
//       let imageUrl = locations.find((l) => l._id === id)?.image || "";
//       if (newImage) {
//         const formData = new FormData();
//         formData.append("file", newImage);
//         const uploadRes = await axios.post("/api/upload", formData, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//         imageUrl = uploadRes.data.secure_url;
//       }

//       await axios.put("/api/admin/toplocations", { id, name: newName, image: imageUrl });
//       toast.success("Updated successfully");
//       setEditId(null);
//       fetchTopLocations();
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to update location");
//     }
//   };

//   // Delete handler
//   const handleDelete = async (id: string) => {
//     if (!confirm("Are you sure?")) return;
//     try {
//       await axios.delete("/api/admin/toplocations", { data: { id } });
//       toast.success("Deleted successfully");
//       fetchTopLocations();
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to delete location");
//     }
//   };

//   // Add new top location
//   const handleAdd = async () => {
//     if (!selectedLocation || !newImage) {
//       return toast.error("Select location and image");
//     }

//     try {
//       const formData = new FormData();
//       formData.append("file", newImage);

//       const uploadRes = await axios.post("/api/upload", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       await axios.post("/api/admin/toplocations", {
//         name: selectedLocation,
//         image: uploadRes.data.secure_url,
//       });

//       toast.success("Top Location added");
//       setSelectedLocation("");
//       setNewImage(null);
//       fetchTopLocations();
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to add top location");
//     }
//   };

//   return (
//     <AdminLayout>
//       <section className="py-10">
//         <h2 className="text-3xl font-semibold mb-6">Top Locations Admin</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {(loading ? Array.from({ length: 8 }) : locations).map((loc, idx) => (
//             <div
//               key={loc?._id || idx}
//               className="relative w-full h-56 rounded-xl overflow-hidden shadow-md group"
//             >
//               {loading ? (
//                 <Skeleton className="w-full h-full" />
//               ) : (
//                 <>
//                   <Image
//                     src={loc.image || "/images/locations/placeholder.jpg"}
//                     alt={loc.name}
//                     fill
//                     className="object-cover group-hover:scale-110 transition duration-500"
//                   />
//                   <div className="absolute inset-0 bg-black/40"></div>

//                   {!editId && (
//                     <div className="absolute bottom-4 left-4 flex flex-col gap-2">
//                       <label className="block text-white mb-1">Select Location</label>
//                       <select
//                         value={selectedLocation}
//                         onChange={(e) => setSelectedLocation(e.target.value)}
//                         className="px-2 py-1 rounded text-black w-full"
//                       >
//                         <option value="">-- Select a location --</option>
//                         {availableLocations.map((loc) => (
//                           <option key={loc} value={loc}>
//                             {loc}
//                           </option>
//                         ))}
//                       </select>

//                       <label className="block text-white mt-2 mb-1">Upload Image</label>
//                       <input
//                         type="file"
//                         onChange={(e) => setNewImage(e.target.files?.[0] || null)}
//                         className="px-2 py-1 rounded text-black w-full"
//                       />

//                       <Button onClick={handleAdd}>Add Top Location</Button>
//                     </div>
//                   )}

//                   <div className="absolute top-4 right-4 flex gap-2">
//                     <Button size="sm" variant="outline" onClick={() => handleEdit(loc)}>
//                       Edit
//                     </Button>
//                     <Button size="sm" variant="destructive" onClick={() => handleDelete(loc._id)}>
//                       Delete
//                     </Button>
//                   </div>

//                   {editId === loc._id && (
//                     <div className="absolute bottom-4 left-4 w-full flex flex-col gap-2 bg-black/50 p-2 rounded">
//                       <input
//                         type="text"
//                         value={newName}
//                         onChange={(e) => setNewName(e.target.value)}
//                         className="px-2 py-1 rounded w-full"
//                       />
//                       <input
//                         type="file"
//                         onChange={(e) => setNewImage(e.target.files?.[0] || null)}
//                         className="px-2 py-1 rounded w-full"
//                       />
//                       <Button onClick={() => handleSave(loc._id)}>Save</Button>
//                       <Button onClick={() => setEditId(null)}>Cancel</Button>
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>
//           ))}
//         </div>
//       </section>
//     </AdminLayout>
//   );
// }
