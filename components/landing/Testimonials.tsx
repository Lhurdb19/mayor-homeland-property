"use client";

import useSWR from "swr";
import axios from "axios";
import { Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

interface Testimonial {
  id: number;
  name: string;
  review: string;
  rating: number;
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function Testimonials() {
  const { data, isLoading } = useSWR<Testimonial[]>(
    "/api/testimonials",
    fetcher,
    {
      refreshInterval: 5000, // 🔥 auto refresh every 5s
      revalidateOnFocus: true,
    }
  );

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-semibold mb-10 text-center">
          🔥 What Our Clients Say
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border p-8 rounded-2xl bg-white">
                <Skeleton className="h-5 w-32 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        ) : data && data.length > 0 ? (
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            autoplay={{ delay: 4500 }}
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {data.map((item) => (
              <SwiperSlide key={item.id} className="flex gap-20">
                <div className="border h-40 py-3 rounded-2xl bg-white flex flex-col items-center shadow-sm hover:shadow-lg transition">
                  <h3 className="font-semibold text-lg text-center">
                    {item.name}
                  </h3>

                  <div className="flex justify-center text-yellow-500 my-1">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-500"
                      />
                    ))}
                  </div>

                  <p className="text-center text-gray-600 text-xs md:text-sm">
                    “{item.review}”
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p className="text-center text-gray-500">
            No testimonials yet. Be the first to leave a review!
          </p>
        )}
      </div>
    </section>
  );
}
