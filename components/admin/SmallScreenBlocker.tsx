"use client";

import { useEffect } from "react";
import Link from "next/link";
import { MonitorX } from "lucide-react";
import { motion } from "framer-motion";
import { signOut } from "next-auth/react";

export default function SmallScreenBlocker() {
  useEffect(() => {
    // 🔒 IMMEDIATE LOGOUT
    signOut({ redirect: false });

    // Optional redirect after logout
    const timer = setTimeout(() => {
      window.location.href = "/";
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-linear-to-br from-blue-400 to-indigo-600 p-6">
      <motion.div
        className="bg-white shadow-xl rounded-xl p-8 max-w-md text-center border border-gray-200"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-center mb-4">
          <MonitorX size={60} className="text-red-500" />
        </div>

        <h1 className="text-2xl text-black/80 font-bold mb-2">
          Screen Too Small
        </h1>

        <p className="text-gray-600 text-sm leading-relaxed mb-6">
          Admin access is restricted on small screens.
          <br />
          You have been logged out for security reasons.
        </p>

        <Link
          href="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg font-medium hover:bg-blue-700 transition shadow-md"
        >
          Go Back to Home
        </Link>

        <p className="text-xs text-gray-400 mt-3">
          Logging out & redirecting…
        </p>
      </motion.div>
    </div>
  );
}
