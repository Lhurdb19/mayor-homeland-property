"use client";

import { ReactNode, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button";

import {
  LayoutDashboard,
  User,
  Wallet,
  Bell,
  Heart,
  Trash2,
  LogOut,
  ChevronRight,
  Shield,
  LockIcon,
  Settings,
  Contact,
  Delete,
} from "lucide-react";

type Role = "user" | "admin";

export default function UserProfileLayout({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const user = session?.user;
  const role: Role = (user?.role as Role) || "user";

  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard/user", roles: ["user", "admin"] },
    { label: "Profile", icon: User, href: "/dashboard/user/profiles", roles: ["user", "admin"] },
    { label: "Wallet", icon: Wallet, href: "/dashboard/user/wallet", roles: ["user"] },
    { label: "Notifications", icon: Bell, href: "/dashboard/user/notifications", roles: ["user", "admin"] },
    { label: "Favorites", icon: Heart, href: "/dashboard/user/favorites", roles: ["user"] },
    { label: "Contacts", icon: Contact, href: "/dashboard/user/contact", roles: ["user"] },
    { label: "Security", icon: LockIcon, href: "/dashboard/user/settings/security", roles: ["user"] },
    { label: "Admin Panel", icon: Shield, href: "/dashboard/admin", roles: ["admin"] },
  ];

  return (
    <SidebarProvider defaultOpen>
      {/* ================= MOBILE HAMBURGER ================= */}
      {/* ================= MOBILE HAMBURGER ================= */}
<div className="md:hidden fixed top-2 left-2 right-2 z-50 flex justify-between items-center border bg-white p-2 rounded shadow-xl">
  <button
    onClick={() => setMobileOpen(!mobileOpen)} // toggle open/close
    className="p-2 border rounded bg-gray-500"
  >
    {mobileOpen ? "✕" : "☰"} {/* Show close icon if open */}
  </button>
  <span className="font-semibold text-black/80 text-xs">{user?.name || "User"}</span>
</div>


      {/* ================= DESKTOP SIDEBAR ================= */}
      <Sidebar collapsible="icon" className="bg-white border-r hidden md:flex pt-20">
        <SidebarHeader className="bg-white border-b px-4 py-3">
          <div className="flex items-start justify-between gap-2">
            <div className="leading-tight group-data-[collapsible=icon]:hidden">
              <p className="font-semibold text-xs text-gray-900">{user?.name || "User"}</p>
              <p className="text-xs text-gray-500 truncate max-w-[150px]">{user?.email || "user@email.com"}</p>
            </div>
            <SidebarTrigger className="text-black/80" />
          </div>
        </SidebarHeader>

        <SidebarContent className="bg-white text-gray-800">
          <SidebarGroup>
            <SidebarGroupLabel className="text-gray-500 group-data-[collapsible=icon]:hidden">Account</SidebarGroupLabel>
            <SidebarMenu>
              {menuItems.filter(item => item.roles.includes(role)).map(item => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild className="group hover:bg-gray-100 hover:text-black">
                    <Link href={item.href} className="flex items-center justify-between w-full">
                      <span className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                      </span>
                      <ChevronRight className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-0.5 group-data-[collapsible=icon]:hidden" />
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton className="group justify-between text-red-600 hover:bg-gray-100 hover:text-black">
                  <Link href="/dashboard/user/delete-account" className="flex items-center gap-3">
                    <Trash2 className="h-4 w-4" />
                    <span className="group-data-[collapsible=icon]:hidden">Delete Account</span>
                  </Link>
                  <ChevronRight className="h-4 w-4 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="bg-white border-t p-2 ">
          <Button variant="ghost" className="w-full justify-between text-gray-700 hover:bg-gray-100 hover:text-black">
            <span className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              <span className="group-data-[collapsible=icon]:hidden">Logout</span>
            </span>
            <ChevronRight className="h-4 w-4 text-gray-400 group-data-[collapsible=icon]:hidden" />
          </Button>
        </SidebarFooter>
      </Sidebar>

      {/* ================= MOBILE SIDEBAR ================= */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* overlay */}
            <div className="bg-black/50 w-full" onClick={() => setMobileOpen(false)} />

            {/* sliding sidebar */}
            <motion.div
              className="bg-black w-full flex flex-col"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >

              {/* Sidebar content */}
              <SidebarContent className="flex-1 overflow-y-auto mt-16">
                <SidebarGroup>
                  <SidebarGroupLabel className="text-gray-500">Account</SidebarGroupLabel>
                  <SidebarMenu className="hover:bg-black/20">
                    {menuItems.filter(item => item.roles.includes(role)).map(item => (
                      <SidebarMenuItem key={item.label} className="">
                        <SidebarMenuButton asChild className="group ">
                          <Link href={item.href} className="flex items-center justify-between w-full ">
                             <span className="flex items-center gap-3">
                              <item.icon className="h-4 w-4" />
                              <span>{item.label}</span>
                            </span>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroup>
              </SidebarContent>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= MAIN CONTENT ================= */}
      <SidebarInset className="bg-white text-gray-900">
        <main className="px-4 py-1">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
