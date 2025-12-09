"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Star } from "lucide-react";


interface Testimonial {
  id: number;
  name: string;
  image: string;
  review: string;
  rating: number;
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[] | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setTestimonials([
        {
          id: 1,
          name: "Michael Adewale",
          image: "/images/users/user1.jpg",
          review:
            "I found the perfect apartment easily. Smooth experience and very reliable service!",
          rating: 5,
        },
        {
          id: 2,
          name: "Sarah Johnson",
          image: "/images/users/user2.jpg",
          review:
            "Super professional! The listings were accurate and the agents were very helpful.",
          rating: 4,
        },
        {
          id: 3,
          name: "Emeka Chukwu",
          image: "/images/users/user3.jpg",
          review:
            "Best platform I’ve used for house hunting. Everything was seamless and fast.",
          rating: 4,
        },
      ]);
    }, 2200);
  }, []);

  const isLoading = !testimonials;

  return (
    <section className="py-20 lg:px-25 px-4">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-semibold mb-10 text-center">
          🔥 What Our Clients Say
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {(isLoading ? Array.from({ length: 3 }) : testimonials)?.map(
            (item: any, index: number) => (
              <div
                key={item?.id || index}
                className="border p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300"
              >
                {isLoading ? (
                  <>
                    {/* Image skeleton */}
                    <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />

                    {/* Name skeleton */}
                    <Skeleton className="h-5 w-32 mx-auto mb-2" />

                    {/* Rating skeleton */}
                    <div className="flex justify-center gap-1 mb-4">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-4" />
                    </div>

                    {/* Review skeleton */}
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </>
                ) : (
                  <>
                    <div className="flex justify-center">
                     
                    </div>

                    <h3 className="text-center font-semibold text-lg">
                      {item.name}
                    </h3>

                    <div className="flex justify-center text-yellow-500 ">
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <Star key={i} />
                      ))}
                    </div>

                    <p className="text-center text-gray-600 mt-2 text-sm">
                      {item.review}
                    </p>
                  </>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
