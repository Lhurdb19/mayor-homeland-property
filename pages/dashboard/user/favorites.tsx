"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import UserProfileLayout from "@/components/user/UserProfileLayout";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await axios.get("/api/favorites/user");
      setFavorites(res.data);
    };
    load();
  }, []);

  return (
    <UserProfileLayout>
      <div className="p-6 max-w-3xl mx-auto text-black dark:text-white">
        <h1 className="text-sm md:text-xl font-bold mb-6">Your Favorite Properties ❤️</h1>

        {favorites.length === 0 ? (
          <p className="text-gray-600">No favorite properties yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {favorites.map((fav: any) => (
              <div key={fav._id} className="border rounded-lg p-2 shadow-sm bg-white">
                <img
                  src={fav.property.images[0]}
                  className="w-full h-30 object-cover rounded-md"
                />
                <h2 className="font-semibold mt-1 text-xs">{fav.property.title}</h2>
                <p className="text-gray-500 text-xs">{fav.property.location}</p>

                <Link
                  href={`/properties/${fav.property._id}`}
                  className="mt-3 text-xs inline-block text-blue-600 hover:underline"
                >
                  View Details →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </UserProfileLayout>
  );
}
