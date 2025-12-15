"use client";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Home, Key, Shield } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  { icon: Home, title: "Buy Homes", description: "Explore thousands of homes for sale across the country." },
  { icon: Key, title: "Rent Homes", description: "Find the perfect rental home that suits your needs." },
  { icon: Shield, title: "Secure Deals", description: "Trusted listings and verified agents for a safe experience." },
];

export default function FeaturesSection() {
  return (
    <section className="lg:py-20 lg:px-25 px-4 bg-white/95">
      <h2 className="text-xl md:text-3xl font-bold text-center mb-0 md:mb-2">Our Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.2 }}
          >
            <Card className="p-4 text-center shadow-lg hover:shadow-xl transition-shadow">
              <feature.icon className="mx-auto text-blue-600" size={25} />
              <CardTitle className="text-sm md:text-xl text-black/80 font-bold">{feature.title}</CardTitle>
              <CardContent className="text-gray-700 text-xs md:text-sm">{feature.description}</CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
