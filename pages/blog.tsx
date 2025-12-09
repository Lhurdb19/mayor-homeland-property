"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
}

export default function BlogPosts() {
  const [posts, setPosts] = useState<BlogPost[] | null>(null);

  useEffect(() => {
    // simulate loading
    setTimeout(() => {
      setPosts([
        {
          id: 1,
          title: "Top 5 Tips for Finding Affordable Apartments in Lagos",
          excerpt:
            "Discover how to secure the perfect home without breaking your budget using these practical real estate strategies…",
          image: "/images/blog/blog1.jpg",
          date: "Oct 27, 2025",
        },
        {
          id: 2,
          title: "How to Know a Legit Real Estate Agency Before Paying",
          excerpt:
            "Avoid scams by following these smart verification steps when dealing with property agents and landlords…",
          image: "/images/blog/blog2.jpg",
          date: "Nov 2, 2025",
        },
        {
          id: 3,
          title: "What to Check Before Renting Any Apartment in Nigeria",
          excerpt:
            "A full checklist of things you MUST inspect before paying for any apartment — electricity, water, security and more…",
          image: "/images/blog/blog3.jpg",
          date: "Nov 6, 2025",
        },
      ]);
    }, 2200);
  }, []);

  const isLoading = !posts;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-semibold mb-10 text-center">
          📰 Latest Blog Posts
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {(isLoading ? Array.from({ length: 3 }) : posts)?.map(
            (post: any, index: number) => (
              <div
                key={post?.id || index}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
              >
                {isLoading ? (
                  <>
                    {/* IMAGE SKELETON */}
                    <Skeleton className="w-full h-52" />

                    <div className="p-5">
                      {/* TITLE SKELETON */}
                      <Skeleton className="h-5 w-3/4 mb-3" />

                      {/* EXCERPT SKELETON */}
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3 mb-2" />
                      <Skeleton className="h-4 w-1/2" />

                      {/* DATE SKELETON */}
                      <Skeleton className="h-4 w-20 mt-4" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="relative w-full h-52">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>

                    <div className="p-5">
                      <h3 className="text-lg font-semibold">{post.title}</h3>

                      <p className="text-gray-600 text-sm mt-2">{post.excerpt}</p>

                      <p className="text-gray-500 text-xs mt-4">{post.date}</p>
                    </div>
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
