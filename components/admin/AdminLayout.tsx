"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Home,
  FileText,
  Users,
  Settings,
  CreditCard,
  Check,
  FileSignature,
  Newspaper,
  Contact,
  Container,
  LockKeyhole,
  ChevronRight,
} from "lucide-react";

import AdminNavbar from "./Navbar";
import SmallScreenBlocker from "./SmallScreenBlocker";

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

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();

  const [darkMode, setDarkMode] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  /* ================= SCREEN SIZE GUARD ================= */
  useEffect(() => {
    const checkScreen = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  /* ================= DARK MODE ================= */
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  if (isSmallScreen) {
    return <SmallScreenBlocker />;
  }

  const navItems = [
    { label: "Dashboard", icon: Home, href: "/dashboard/admin" },
    { label: "Properties", icon: FileText, href: "/dashboard/admin/properties" },
    { label: "About Page", icon: Container, href: "/dashboard/admin/about" },
    { label: "Users", icon: Users, href: "/dashboard/admin/users" },
    { label: "Transactions", icon: CreditCard, href: "/dashboard/admin/transactions" },
    { label: "Featured", icon: FileSignature, href: "/dashboard/admin/featured" },
    { label: "Contacts", icon: Contact, href: "/dashboard/admin/contact" },
    { label: "Inquiries", icon: Check, href: "/dashboard/admin/inquiries" },
    { label: "Newsletter", icon: Newspaper, href: "/dashboard/admin/newsletter" },
    { label: "Settings", icon: Settings, href: "/dashboard/admin/settings" },
    { label: "Security", icon: LockKeyhole, href: "/dashboard/admin/security" },
  ];

  return (
    <SidebarProvider defaultOpen>
      {/* ================= SIDEBAR ================= */}
      <Sidebar collapsible="icon" className="bg-white border-r hidden md:flex pt-2">
        {/* Header */}
        <SidebarHeader className="border-b px-4 py-3">
          <div className="flex items-center justify-between gap-2">
            <div className="group-data-[collapsible=icon]:hidden">
              <p className="font-semibold text-sm text-gray-900">Admin Panel</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
            <SidebarTrigger className="text-black/80" />
          </div>
        </SidebarHeader>

        {/* Menu */}
        <SidebarContent className="bg-white text-gray-800">
          <SidebarGroup>
            <SidebarGroupLabel className="text-gray-500 group-data-[collapsible=icon]:hidden">
              Management
            </SidebarGroupLabel>

            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;

                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      asChild
                      className={`group ${
                        active ? "bg-blue-100 font-semibold" : "hover:bg-gray-100"
                      }`}
                    >
                      <Link href={item.href} className="flex items-center justify-between w-full">
                        <span className="flex items-center gap-3">
                          <Icon className="h-4 w-4" />
                          <span className="group-data-[collapsible=icon]:hidden">
                            {item.label}
                          </span>
                        </span>
                        <ChevronRight className="h-4 w-4 text-gray-400 group-data-[collapsible=icon]:hidden" />
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        {/* Footer */}
        <SidebarFooter className="border-t p-2">
          <Button
            variant="ghost"
            className="w-full justify-between text-gray-700 hover:bg-gray-100 hover:text-black"
          >
            <span className="group-data-[collapsible=icon]:hidden">Admin Controls</span>
          </Button>
        </SidebarFooter>
      </Sidebar>

      {/* ================= MAIN ================= */}
      <SidebarInset className="bg-white text-gray-900">
        <AdminNavbar />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
