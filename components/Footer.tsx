"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FacebookIcon, Instagram, Linkedin, Twitter } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import Logo from "./logo";

export default function Footer() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const { data: session } = useSession();

  useEffect(() => {
    setTimeout(() => setLoading(false), 1800);
  }, []);

  const handleSubscribe = async () => {
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    try {
      const userId = session?.user?.id;

      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, userId }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Subscription failed");
        return;
      }

      toast.success(data.message);
      setEmail("");
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    }
  };

  return (
    <footer className="bg-gray-100 text-black py-8 px-6 lg:px-25">
      <div className="max-w-8xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

        {/* Brand / Logo */}
        <div className="flex flex-col gap-5 border-l-black w-full">
          {loading ? (
            <Skeleton className="h-8 w-40 mb-4" />
          ) : (
            // <h2 className="text-2xl font-bold text-blue-500 mb-4">Dream Land</h2>
            <Link href='/' className="w-[200px] border rounded-xl p-2 h-[50px]">
            <Logo/>
            </Link>
          )}

          {loading ? (
            <Skeleton className="h-4 w-4/4" />
          ) : (
            <p className="text-gray-600 text-sm">
              Trusted real estate platform delivering the best listings, insights, and services.
            </p>
          )}
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-5 border-l-black w-full">
          <h3 className="font-semibold mb-4">Quick Links</h3>
          {loading ? (
            <>
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-4 w-32 mb-2" />
            </>
          ) : (
            <ul className="space-y-2 text-gray-600 text-xs">
              <li><Link href="/properties">Properties</Link></li>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
            </ul>
          )}
        </div>

        {/* Contact Info */}
        <div className="flex flex-col gap-5 border-l-black w-full">
          <h3 className="font-semibold mb-4">Contact Us</h3>
          {loading ? (
            <>
              <Skeleton className="h-4 w-40 mb-2" />
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-4 w-32 mb-2" />
            </>
          ) : (
            <ul className="space-y-2 text-gray-600 text-xs">
              <li>📍 Amodu Tijani Cl, Victoria Island, Lagos 106104, Lagos, Nigeria</li>
              <li>📞 +234 816 836 3469</li>
              <li>✉️  mubarakshittu411@gmail.com</li>
            </ul>
          )}
        </div>

        {/* Newsletter */}
        <div className="flex flex-col gap-5 border-l-black w-full">
          <h3 className="font-semibold mb-4">Newsletter</h3>
          {loading ? (
            <>
              <Skeleton className="h-12 w-full mb-2" />
              <Skeleton className="h-12 w-32 mb-4" />
              <Skeleton className="h-6 w-48" />
            </>
          ) : (
            <>
              <div className="flex mb-4 gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 w-full border border-gray-600"
                />
                <Button
                  onClick={handleSubscribe}
                  className="h-11 px-4 bg-blue-600 hover:bg-blue-700 text-gray-50"
                >
                  Subscribe
                </Button>
              </div>

              <div className="flex space-x-3 mt-4 text-sm">
                <a href="#" aria-label="Facebook "><FacebookIcon className="w-4 h-4 hover:text-blue-500" /></a>
                <a href="#" aria-label="Twitter"><Twitter className="w-4 h-4 hover:text-gray-500" /></a>
                <a href="#" aria-label="Instagram"><Instagram className="w-4 h-4 hover:text-pink-900" /></a>
                <a href="#" aria-label="LinkedIn"><Linkedin className="w-4 h-4 hover:text-blue-700" /></a>
              </div>
            </>
          )}
        </div>

      </div>

     <div className="relative mt-12 border-t border-gray-700 pt-2 pb-10 md:pb-0 text-gray-500 text-sm overflow-hidden">

  {loading ? (
    <Skeleton className="h-4 w-full" />
  ) : (
    <div className="relative z-10 flex flex-col md:flex-row items-center text-center justify-between gap-2">
      <p>
        © {new Date().getFullYear()} Mayor Homeland Property. All rights reserved.
      </p>

      <p className="text-xs">
        Powered by{" "}
        <a
          href="https://hejidev.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-blue-400 hover:text-blue-600 transition-colors duration-200"
        >
          HejiDev
        </a>
      </p>
    </div>
  )}
</div>
    </footer>
  );
}
