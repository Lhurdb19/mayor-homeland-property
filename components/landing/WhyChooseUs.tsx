"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldCheck, Home, Search, Users } from "lucide-react";

type FeatureType = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

export default function WhyChooseUs() {
  const [features, setFeatures] = useState<FeatureType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setFeatures([
        {
          title: "Trusted by Thousands",
          description:
            "Over 10,000 Nigerians rely on us for finding their dream homes with confidence and transparency.",
          icon: <Users size={40} className="text-blue-600" />,
        },
        {
          title: "Verified Listings Only",
          description:
            "Every property is thoroughly checked to ensure authenticity, correct documentation, and real ownership.",
          icon: <ShieldCheck size={40} className="text-blue-600" />,
        },
        {
          title: "Advanced Search Filters",
          description:
            "Find homes faster using smart filters, price ranges, locations, and personalized recommendations.",
          icon: <Search size={40} className="text-blue-600" />,
        },
        {
          title: "Expert Support",
          description:
            "Our real-estate experts are always ready to guide you through buying, renting, or investing.",
          icon: <Home size={40} className="text-blue-600" />,
        },
      ]);
      setLoading(false);
    }, 1800);
  }, []);

  return (
    <div className="py-10 px-4 md:px-25 max-w-7xl mx-auto bg-white">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl font-bold text-center mb-12"
      >
        Why Choose Us
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <FeatureSkeleton key={i} />)
          : features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
              >
                <FeatureCard feature={feature} />
              </motion.div>
            ))}
      </div>
    </div>
  );
}

function FeatureCard({ feature }: { feature: FeatureType }) {
  return (
    <Card className="rounded-xl shadow-md hover:shadow-xl transition-all p-4 text-center">
      <div className="flex justify-center">{feature.icon}</div>
      <h3 className="text-sm font-semibold mb-1">{feature.title}</h3>
      <p className="text-gray-600 text-[11px]">{feature.description}</p>
    </Card>
  );
}

function FeatureSkeleton() {
  return (
    <Card className="rounded-xl shadow-md p-6 text-center space-y-4">
      <div className="flex justify-center">
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
      <Skeleton className="h-5 w-3/4 mx-auto" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6 mx-auto" />
    </Card>
  );
}
