"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

import {
  Home,
  User,
  Bell,
  Settings,
  Phone,
  Trash2,
  ChevronDown,
  ChevronRight,
  Sun,
  Moon,
  LogOut,
  Menu,
  X,
} from "lucide-react";

interface SidebarItem {
  title: string;
  icon: any;
  link?: string;
  children?: { title: string; link: string }[];
}

const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    link: "/dashboard/user",
    icon: Home,
  },

  {
    title: "Profile",
    icon: User,
    children: [
      { title: "View Profile", link: "/dashboard/user/profiles" },
      { title: "Edit Profile", link: "/dashboard/user/profiles/edit" },
    ],
  },

  {
    title: "Notifications",
    icon: Bell,
    children: [
      { title: "All Notifications", link: "/dashboard/user/notifications" },
      { title: "Preferences", link: "/dashboard/user/notifications/preferences" },
    ],
  },

  {
    title: "Contact",
    link: "/dashboard/user/contact",
    icon: Phone,
  },

  {
    title: "Settings",
    icon: Settings,
    children: [
      { title: "Account Settings", link: "/dashboard/user/settings/account" },
      { title: "Security", link: "/dashboard/user/settings/security" },
      { title: "Appearance", link: "/dashboard/user/settings/theme" },
    ],
  },

  {
    title: "Delete Account",
    link: "/dashboard/user/delete-account",
    icon: Trash2,
  },
];


export default function UserProfileLayout({ children }: { children: React.ReactNode }) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();

  const toggleSection = (title: string) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 dark:bg-gray-800 shadow">
        <button onClick={() => setMobileMenuOpen(true)}>
          <Menu size={26} />
        </button>
        <h2 className="text-lg font-bold">My Account</h2>
      </div>

      <div className="min-h-10 flex flex-col md:flex-row bg-white dark:bg-black">
        <aside
          className={`
          fixed top-0 left-0 h-full lg:max-w-64 xl:w-45 p-4 border-r 
          border-gray-200 dark:border-gray-800 
          bg-black/1 text-black dark:text-white dark:bg-gray-900 shadow-md z-50 
          transform transition-transform duration-300
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
        >
          {/* Close Button - Mobile Only */}
          <button
            className="md:hidden absolute top-4 right-4"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>

          <h2 className="md:text-xl text-md font-bold mb-6 mt-2">My Account</h2>

          <nav className="space-y-1 text-xs md:text-xl">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.link;

              return (
                <div key={item.title}>
                  {/* PARENT WITH CHILDREN */}
                  {item.children ? (
                    <>
                      <button
                        onClick={() => toggleSection(item.title)}
                        className={`flex items-center justify-between w-full p-2 rounded-md 
                          text-left hover:bg-gray-100 dark:hover:bg-gray-800 text-xs md:text-xl
                          ${isActive ? "bg-gray-200 dark:bg-gray-700 font-semibold text-xs md:text-lg" : ""}`}
                      >
                        <div className="flex items-center gap-2 text-xs md:text-sm">
                          <item.icon size={18} />
                          {item.title}
                        </div>
                        {openSections[item.title] ? (
                          <ChevronDown size={18} />
                        ) : (
                          <ChevronRight size={18} />
                        )}
                      </button>

                      {openSections[item.title] && (
                        <div className="pl-6 space-y-1 text-xs md:text-sm">
                          {item.children.map((child) => {
                            const childActive = pathname === child.link;
                            return (
                              <Link
                                key={child.title}
                                href={child.link}
                                className={`block py-1 text-sm hover:text-blue-500 ${childActive ? "text-blue-500 font-semibold" : ""
                                  }`}
                              >
                                {child.title}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </>
                  ) : (
                    /* NORMAL SINGLE LINK */
                    <Link
                      href={item.link!}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`
                        flex items-center gap-2 p-2 rounded-md 
                        hover:bg-gray-100 dark:hover:bg-gray-800 
                        text-xs md:text-sm
                        ${isActive ? "bg-gray-200 text-xs md:text-sm dark:bg-gray-700 font-semibold" : ""}
                        ${item.title === "Delete Account" ? "text-red-400 font-semibold" : ""}
                      `}
                    >
                      <item.icon size={18} />
                      {item.title}
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Theme Switcher */}
          <div className="mt-6">
            <Button
              variant="outline"
              onClick={toggleTheme}
              className="flex items-center gap-2 w-full justify-center text-xs md:text-sm"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </Button>
          </div>

          {/* Logout */}
          <div className="mt-4">
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="flex items-center gap-2 w-full justify-center text-xs md:text-sm"
            >
              <LogOut size={18} /> Logout
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 text-xs md:text-xl md:ml-6 p-4 sm:p-6 md:p-8 w-full overflow-x-hidden">
          {children}
        </main>

      </div>
    </>
  );
}
