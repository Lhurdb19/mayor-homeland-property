"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";
import ServicesPage from "@/components/Services";

export default function AboutPage() {
  const [loading, setLoading] = useState(true);
  const [about, setAbout] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/about");
        const json = await res.json();
        if (res.ok) setAbout(json.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="max-w-8xl bg-white text-black/80 mx-auto py-20 space-y-8">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  if (!about) {
    return (
      <div className="max-w-8xl mx-auto py-20 text-center">
        <p className="text-gray-500 text-lg">About content is not yet configured.</p>
      </div>
    );
  }

  return (
    <div className="max-w-8xl mx-auto py-17 md:py-20 px-4 lg:px-25 space-y-20 bg-white">

      {/* ===========================
          HERO BANNER
      ============================ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-xl overflow-hidden shadow-xl h-[300px]"
      >
        {about.bannerImage ? (
          <img
            src={about.bannerImage}
            alt="banner"
            className="w-full h-full text-center object-cover brightness-[0.75]"
          />
        ) : (
          <div className="w-full h-full bg-gray-100"></div>
        )}

        <div className="absolute inset-0 flex flex-col items-center text-center justify-center text-white px-6">
          <h1 className="text-2xl md:text-4xl font-bold text-white tracking-tight drop-shadow-lg">
            {about.ownerName || "Our Company"}
          </h1>
          <p className="mt-2 text-sm md:text-xl text-gray-100 max-w-2xl text-center">
            Building trust through quality, integrity and excellence.
          </p>
        </div>
      </motion.div>


      {/* ===========================
          STORY + FOUNDER COLUMN
      ============================ */}
      <div className="grid md:grid-cols-3 gap-12 text-black">

        {/* Top Mobile Responsive (founder card) */}
        <motion.aside
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 block md:hidden"
        >
          <Card className="p-4 shadow- text-gray-700 bg-white/80">
            <h3 className="font-semibold text-black/80 text-sm">Founded</h3>
            <p className="text-gray-700 text-sm">
              {about.foundedYear} — {about.foundedLocation}
            </p>
          </Card>

          <Card className="p-4 shadow-md text-center backdrop-blur bg-white/80">
            <h3 className="font-semibold text-lg">Founder / C.E.O</h3>
            {about.ownerImage && (
              <img
                src={about.ownerImage}
                alt="owner"
                className="w-30 h-30 rounded-full mx-auto object-cover shadow"
              />
            )}
            <p className="font-medium text-gray-800 text-sm">{about.ownerName}</p>
          </Card>
        </motion.aside>

        {/* LEFT (story) */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-2 space-y-2"
        >
          <h2 className="text-xl md:text-3xl font-semibold">Our Story</h2>
          <p className="text-gray-400 leading-relaxed text-xs md:text-sm">
            {about.story}
          </p>

          <div className="grid sm:grid-cols-2 gap-6 pt-6">
            <Card className="hover:shadow-md transition-all">
              <CardHeader>
                <CardTitle className="text-xl -my-4 text-black/80">Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-xs md:text-sm text-gray-700">{about.mission}</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-all">
              <CardHeader>
                <CardTitle className="text-xl -my-4 text-black/80">Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-xs md:text-sm text-gray-700">{about.vision}</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* RIGHT (founder card) */}
        <motion.aside
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 md:block hidden"
        >
          <Card className="p-6 shadow-md backdrop-blur bg-white/80">
            <h3 className="font-semibold text-xl">Founded</h3>
            <p className="text-gray-600 mt-1">
              {about.foundedYear} — {about.foundedLocation}
            </p>
          </Card>

          <Card className="p-4 shadow-md text-center backdrop-blur bg-white/80">
            <h3 className="font-semibold text-xl">Founder / C.E.O</h3>
            {about.ownerImage && (
              <img
                src={about.ownerImage}
                alt="owner"
                className="w-50 h-50 rounded-full mx-auto object-cover mt-4 shadow"
              />
            )}
            <p className="font-medium text-gray-800 text-lg">{about.ownerName}</p>
          </Card>
        </motion.aside>
      </div>


      {/* ===========================
          TEAM SECTION
      ============================ */}
    
      <ServicesPage />
    </div>
  );
}
