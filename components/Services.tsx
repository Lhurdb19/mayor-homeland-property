"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const services = [
  { title: "Real Estate Management", desc: "Efficient property management solutions.", icon: "🏢" },
  { title: "Interior Design", desc: "Creative interior solutions for home and office.", icon: "🎨" },
  { title: "Project Supervision", desc: "Expert supervision for successful project delivery.", icon: "🛠️" },
  { title: "Building Construction", desc: "High-quality construction services for all building types.", icon: "🏗️" },
];

export default function ServicesPage() {
  return (
    <div className="max-w-7xl mx-auto py-1 px-4 space-y-0 text-black/80">
      <h1 className="text-xl md:text-3xl font-bold text-center">Our Services</h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mt-1 md:mt-5">
        {services.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-2 hover:shadow-lg transition-all rounded-xl text-center">
              <div className="text-xl md:text-3xl">{s.icon}</div>
              <CardHeader>
                <CardTitle className="text-sm md:text-md mt-0 ">{s.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-xs">{s.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
