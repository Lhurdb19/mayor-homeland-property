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
      <div className="max-w-8xl mx-auto py-20 space-y-8">
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
    <div className="max-w-8xl mx-auto py-17 md:py-20 px-4 lg:px-25 space-y-20">

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
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight drop-shadow-lg">
            {about.ownerName || "Our Company"}
          </h1>
          <p className="mt-4 text-sm md:text-xl text-gray-100 max-w-2xl text-center">
            Building trust through quality, integrity and excellence.
          </p>
        </div>
      </motion.div>


      {/* ===========================
          STORY + FOUNDER COLUMN
      ============================ */}
      <div className="grid md:grid-cols-3 gap-12">

        {/* Top Mobile Responsive (founder card) */}
        <motion.aside
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 block md:hidden"
        >
          <Card className="p-4 shadow-md backdrop-blur bg-white/80">
            <h3 className="font-semibold text-lg">Founded</h3>
            <p className="text-gray-600">
              {about.foundedYear} — {about.foundedLocation}
            </p>
          </Card>

          <Card className="p-4 shadow-md text-center backdrop-blur bg-white/80">
            <h3 className="font-semibold text-lg">Founder / C.E.O</h3>
            {about.ownerImage && (
              <img
                src={about.ownerImage}
                alt="owner"
                className="w-35 h-35 rounded-full mx-auto object-cover shadow"
              />
            )}
            <p className="font-medium text-gray-800 text-lg">{about.ownerName}</p>
          </Card>
        </motion.aside>

        {/* LEFT (story) */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-2 space-y-2"
        >
          <h2 className="text-xl md:text-3xl font-semibold">Our Story</h2>
          <p className="text-gray-400 leading-relaxed text-sm md:text-lg">
            {about.story}
          </p>

          <div className="grid sm:grid-cols-2 gap-6 pt-4">
            <Card className="hover:shadow-md transition-all">
              <CardHeader>
                <CardTitle className="text-xl -my-4">Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-xs md:text-lg text-gray-500">{about.mission}</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-all">
              <CardHeader>
                <CardTitle className="text-xl -my-4">Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-xs md:text-lg text-gray-500">{about.vision}</p>
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <h2 className="text-3xl font-semibold">Meet the Team</h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
          {(about.team || []).map((m: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg p-5 shadow hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className="w-40 h-40 mx-auto rounded-full overflow-hidden shadow">
                {m.image && (
                  <img
                    src={m.image}
                    alt={m.name}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <div className="text-center mt-4">
                <h3 className="font-semibold text-lg">{m.name}</h3>
                <p className="text-gray-500 text-sm">{m.role}</p>
              </div>

              {/* Socials */}
              <div className="flex justify-center gap-4 mt-4 text-xl text-gray-600">
                {m.facebook && (
                  <a href={m.facebook} target="_blank">
                    <FaFacebook className="hover:text-blue-600" />
                  </a>
                )}
                {m.instagram && (
                  <a href={m.instagram} target="_blank">
                    <FaInstagram className="hover:text-pink-600" />
                  </a>
                )}
                {m.twitter && (
                  <a href={m.twitter} target="_blank">
                    <FaTwitter className="hover:text-sky-500" />
                  </a>
                )}
                {m.linkedin && (
                  <a href={m.linkedin} target="_blank">
                    <FaLinkedin className="hover:text-blue-700" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <ServicesPage />
    </div>
  );
}
