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
    setTimeout(() => {
      setPosts([
        {
          id: 1,
          title: "Top 5 Tips for Finding Affordable Apartments in Lagos",
          excerpt:
            "Discover how to secure the perfect home without breaking your budget using these practical real estate strategies…",
          image: "/keys.avif",
          date: "Oct 27, 2025",
        },
        {
          id: 2,
          title: "How to Know a Legit Real Estate Agency Before Paying",
          excerpt:
            "Avoid scams by following these smart verification steps when dealing with property agents and landlords…",
          image: "/key3.jpg",
          date: "Nov 2, 2025",
        },
        {
          id: 3,
          title: "What to Check Before Renting Any Apartment in Nigeria",
          excerpt:
            "A full checklist of things you MUST inspect before paying for any apartment — electricity, water, security and more…",
          image: "/key.webp",
          date: "Nov 6, 2025",
        },
      ]);
    }, 2200);
  }, []);

  const isLoading = !posts;

  return (
    <section className="max-w-8xl py-20 bg-gray-50 text-black/90 px-4 md:px-25">
      <div className="mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center text-gray-900">
          📰 Latest Blog Posts
        </h2>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {(isLoading ? Array.from({ length: 3 }) : posts)?.map(
            (post: any, index: number) => (
              <div
                key={post?.id || index}
                className="bg-white rounded-2xl shadow-md hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col"
              >
                {isLoading ? (
                  <>
                    <Skeleton className="w-full h-56" />
                    <div className="p-5 flex-1 flex flex-col">
                      <Skeleton className="h-6 w-3/4 mb-3" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-4" />
                      <Skeleton className="h-4 w-24 mt-auto" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="relative w-full h-56">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-semibold mb-2 text-gray-900">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 text-sm">{post.excerpt}</p>
                      </div>

                      <div className="mt-4 flex justify-between items-center">
                        <p className="text-gray-500 text-xs">{post.date}</p>
                        <button className="text-blue-600 text-sm font-medium hover:underline">
                          Read More →
                        </button>
                      </div>
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
