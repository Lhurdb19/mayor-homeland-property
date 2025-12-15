"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X, Home, Info, Phone, Tag, Layers, User } from "lucide-react";
import Logo from "./logo";
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";

type NavLink = {
  href: string;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
};

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (pathname?.startsWith("/dashboard/admin")) return null;

  const initials = session?.user
    ? `${session.user.firstName?.[0] || ""}${session.user.lastName?.[0] || ""}`.toUpperCase()
    : "";

  const commonLinks: NavLink[] = [
    { href: "/sale", label: "For Sale", icon: <Tag size={18} /> },
    { href: "/rent", label: "For Rent", icon: <Tag size={18} /> },
    { href: "/lease", label: "For Lease", icon: <Layers size={18} /> },
    { href: "/land", label: "Land Properties", icon: <Layers size={18} /> },
  ];

  const authLinks: NavLink[] = session
    ? [
        {
          href: "/dashboard/user",
          label: "Profile",
          icon: <User size={18} />,
        },
        {
          href: "#",
          label: "Logout",
          icon: <X size={18} />,
          onClick: () => signOut({ callbackUrl: "/" }),
        },
      ]
    : [
        { href: "/auth/login", label: "Login", icon: <User size={18} /> },
        { href: "/auth/register", label: "Sign Up", icon: <User size={18} /> },
      ];

  const moreLinks = [...commonLinks, ...authLinks];

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden max-w-screen md:flex w-full bg-white shadow-md fixed top-0 z-50 h-16 items-center px-6 lg:px-20">
        <div className="w-full flex justify-between items-center text-black gap-10">
          <Link href="/" className="w-[180px] h-[15px] -translate-y-5 z-10">
            <Logo />
          </Link>

          <div className="flex space-x-4 z-20">
            <Link href="/sale" className="hover:text-blue-600 text-sm font-medium">For Sale</Link>
            <Link href="/rent" className="hover:text-blue-600 text-sm font-medium">For Rent</Link>
            <Link href="/lease" className="hover:text-blue-600 text-sm font-medium">For Lease</Link>
            <Link href="/land" className="hover:text-blue-600 text-sm font-medium">Land</Link>
            <Link href="/properties" className="hover:text-blue-600 text-sm font-medium">Properties</Link>
            <Link href="/about" className="hover:text-blue-600 text-sm font-medium">About</Link>
            <Link href="/contact" className="hover:text-blue-600 text-sm font-medium">Contact</Link>
          </div>

          <div className="flex items-center space-x-4">
            {!session ? (
              <>
                <Link href="/auth/login" className="text-gray-700 hover:text-blue-600 text-sm font-medium">Login</Link>
                <Link href="/auth/register" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">Sign Up</Link>
              </>
            ) : (
              <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger>
                  <button className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center">
                    {initials}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white p-3 shadow-lg rounded-xl text-black">
                  <DropdownMenuItem onClick={() => router.push("/dashboard/user")}>Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile: Top Logo */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-white shadow-md z-50 flex justify-center py-2">
        <Link href="/" className="w-full h-[50px] translate-x-25 pt-5">
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

          <button onClick={() => setMenuOpen(!menuOpen)} className="flex flex-col items-center text-gray-700">
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

          {moreLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => {
                setMenuOpen(false);
                link.onClick ? link.onClick() : router.push(link.href);
              }}
              className="flex items-center space-x-3 py-3 text-gray-700 hover:text-blue-600 border-b border-gray-200 w-full text-left"
            >
              {link.icon}
              <span>{link.label}</span>
            </button>
          ))}

        </div>
      )}
    </>
  );
}
