"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

interface CTASectionProps {
  show: boolean;
}

export default function CTASection({ show }: CTASectionProps) {
  if (!show) return null; // Hide if user is logged in

  return (
    <section className="py-20 bg-blue-600 text-white text-center px-6">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold mb-4"
      >
        Ready to Find Your Home?
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-6 max-w-lg mx-auto"
      >
        Join thousands of happy users who have found their perfect home.
      </motion.p>
      <Link href="/auth/register">
        <Button className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg shadow-lg hover:scale-105 transition-transform">
          Get Started
        </Button>
      </Link>
    </section>
  );
}
