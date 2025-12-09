"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Home, Info, Phone, Tag, Layers, User } from "lucide-react";
import Logo from "./logo";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  if (pathname?.startsWith("/dashboard/admin")) return null;

  const initials = session?.user
    ? `${session.user.firstName?.[0] || ""}${session.user.lastName?.[0] || ""}`.toUpperCase()
    : "";

  const commonLinks = [
    { href: "/sale", label: "For Sale", icon: <Tag size={18} /> },
    { href: "/rent", label: "For Rent", icon: <Tag size={18} /> },
    { href: "/lease", label: "For Lease", icon: <Layers size={18} /> },
    { href: "/land", label: "Land Properties", icon: <Layers size={18} /> },
  ];

  const authLinks = session
    ? [
        { href: "/dashboard/user", label: "Profile", icon: <User size={18} /> },
        { href: "#", label: "Logout", icon: <X size={18} />, onClick: () => signOut({ callbackUrl: "/" }) },
      ]
    : [
        { href: "/auth/login", label: "Login", icon: <User size={18} /> },
        { href: "/auth/register", label: "Sign Up", icon: <User size={18} /> },
      ];

  const moreLinks = [...commonLinks, ...authLinks];

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex w-full bg-white shadow-md fixed top-0 z-50 h-16 items-center px-6 lg:px-20">
        {/* desktop code unchanged */}
      </nav>

      {/* Mobile Top Logo */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-white shadow-md z-50 flex justify-center py-2">
        <Link href="/" className="w-[190px] h-[30px]">
          <Logo />
        </Link>
      </div>

      {/* Mobile Bottom Navbar */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white shadow-t z-50">
        <div className="flex justify-around items-center h-16">
          <Link href="/properties" className="flex flex-col items-center text-gray-700">
            <Home size={20} />
            <span className="text-xs">Properties</span>
          </Link>
          <Link href="/about" className="flex flex-col items-center text-gray-700">
            <Info size={20} />
            <span className="text-xs">About</span>
          </Link>
          <Link href="/contact" className="flex flex-col items-center text-gray-700">
            <Phone size={20} />
            <span className="text-xs">Contact</span>
          </Link>
          {/* Hamburger / User Initials */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex flex-col items-center text-gray-700"
          >
            {session ? (
              <span className="w-6 h-6 bg-blue-600 text-white font-bold rounded-full flex items-center justify-center text-xs">
                {initials}
              </span>
            ) : menuOpen ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}
            {!session && <span className="text-xs">Menu</span>}
          </button>
        </div>
      </nav>

      {/* Mobile Overlay Menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-white z-40 p-6 pt-20 overflow-y-auto">
          {moreLinks.map((link) =>
            link.label === "Logout" ? (
              <button
                key={link.label}
                onClick={() => {
                  setMenuOpen(false);
                  link.onClick?.();
                }}
                className="flex items-center space-x-3 py-3 text-gray-700 hover:text-blue-600 border-b border-gray-200 w-full text-left"
              >
                {link.icon}
                <span>{link.label}</span>
              </button>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center space-x-3 py-3 text-gray-700 hover:text-blue-600 border-b border-gray-200"
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            )
          )}
        </div>
      )}
    </>
  );
}
