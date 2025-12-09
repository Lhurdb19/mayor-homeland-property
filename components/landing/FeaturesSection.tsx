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
    <section className=" lg:px-25 px-4 ">
      <h2 className="text-xl md:text-3xl font-bold text-center mb-5 md:mb-10">Our Services</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.2 }}
          >
            <Card className="p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
              <feature.icon className="mx-auto text-blue-600 mb-0 md:mb-4" size={30} />
              <CardTitle className="text-sm md:text-xl font-bold mb-2">{feature.title}</CardTitle>
              <CardContent className="text-gray-50 text-xs md:text-sm">{feature.description}</CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
