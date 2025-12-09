"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home, FileText, Users, Settings, PlusCircle, Moon, Sun,
    ChevronLeft, ChevronRight, CreditCard, Check, FileSignature, Bell,
    Newspaper,
    Contact,
    Container,
    LockKeyhole
} from "lucide-react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AdminNavbar from "./Navbar";

import SmallScreenBlocker from "./SmallScreenBlocker";


interface AdminLayoutProps {
    children: React.ReactNode;
}

interface NotificationType {
    _id: string;
    title: string;
    message: string;
    link?: string;
    read: boolean;
    createdAt: string;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState<NotificationType[]>([]);
    const [notifOpen, setNotifOpen] = useState(false);

    const pathname = usePathname();

    const [isSmallScreen, setIsSmallScreen] = useState(false);

useEffect(() => {
  const checkScreen = () => {
    if (window.innerWidth < 768) setIsSmallScreen(true);
    else setIsSmallScreen(false);
  };

  checkScreen();
  window.addEventListener("resize", checkScreen);

  return () => window.removeEventListener("resize", checkScreen);
}, []);


    const navItems = [
        { name: "Dashboard", icon: <Home size={20} />, href: "/dashboard/admin" },
        { name: "Properties", icon: <FileText size={20} />, href: "/dashboard/admin/properties" },
        { name: "About Page", icon: <Container size={20} />, href: "/dashboard/admin/about" },
        { name: "Users", icon: <Users size={20} />, href: "/dashboard/admin/users" },
        { name: "Transactions", icon: <CreditCard size={20} />, href: "/dashboard/admin/transactions" },
        { name: "Settings", icon: <Settings size={20} />, href: "/dashboard/admin/settings" },
        { name: "Featured", icon: <FileSignature size={20} />, href: "/dashboard/admin/featured" },
        { name: "Contacts", icon: <Contact size={20} />, href: "/dashboard/admin/contact" },
        { name: "Inquiries", icon: <Check size={20} />, href: "/dashboard/admin/inquiries" },
        { name: "Newsletter", icon: <Newspaper size={20} />, href: "/dashboard/admin/newsletter" },
        { name: "Security", icon: <LockKeyhole size={20} />, href: "/dashboard/admin/security" },
    ];

    useEffect(() => {
        if (darkMode) document.documentElement.classList.add("dark");
        else document.documentElement.classList.remove("dark");
    }, [darkMode]);

    // Fetch notifications
    const fetchNotifications = async () => {
        try {
            const res = await axios.get("/api/notifications");
            setNotifications(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const interval = setInterval(fetchNotifications, 5000); // every 5s
        return () => clearInterval(interval);
    }, []);


    const markAsRead = async (id: string) => {
        await axios.put(`/api/notifications/${id}`);
        fetchNotifications();
    };

    if (isSmallScreen) {
  return <SmallScreenBlocker />;
}

    return (
        <div className={`flex h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
            {/* Sidebar */}
            <aside className={`bg-white dark:bg-gray-800 shadow-md transition-all duration-300 ${sidebarOpen ? "w-64" : "w-16"} flex flex-col`}>
                <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                    {sidebarOpen && <h1 className="font-bold text-lg">Admin Panel</h1>}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 rounded border border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 transition w-5 h-5 flex items-center justify-center text-center"
                        >
                            <span>{sidebarOpen ? <ChevronLeft /> : <ChevronRight />}</span>
                        </button>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-2 p-2 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${pathname === item.href ? "bg-blue-100 dark:bg-blue-900 font-bold" : ""}`}
                        >
                            {item.icon}
                            {sidebarOpen && <span>{item.name}</span>}
                        </Link>
                    ))}
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition flex items-center gap-2 w-full"
                    >
                        {darkMode ? <Sun size={20} /> : <Moon size={20} />} {sidebarOpen && <span>Theme</span>}
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col">
                <AdminNavbar />
                <div className="flex justify-end p-4 border-b dark:border-gray-700 relative">
                    {/* Notifications */}
                    <div className="relative">
                        <button onClick={() => setNotifOpen(!notifOpen)} className="relative">
                            <Bell size={24} />
                            {notifications.filter(n => !n.read).length > 0 && (
                                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                            )}
                        </button>
                        {notifOpen && (
                            <div className="absolute right-0 mt-2 w-96 max-h-96 overflow-auto bg-white dark:bg-gray-800 shadow-lg rounded-md z-50">
                                <Card className="p-2">
                                    <CardHeader>
                                        <CardTitle>Notifications</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        {notifications.length === 0 ? (
                                            <p>No notifications</p>
                                        ) : (
                                            notifications.map((n) => (
                                                <div key={n._id} className={`p-2 border rounded ${n.read ? "bg-gray-100 dark:bg-gray-700" : "bg-gray-200 dark:bg-gray-600"}`}>
                                                    <Link href={n.link || "#"} className="block">
                                                        <h3 className="font-semibold">{n.title}</h3>
                                                        <p className="text-sm text-blue-400">{n.message}</p>
                                                        <p className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleString()}</p>
                                                    </Link>
                                                    {!n.read && (
                                                        <Button variant="outline" onClick={() => markAsRead(n._id)}>
                                                            Mark as Read
                                                        </Button>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </div>
                </div>

                {/* Page Content */}
                <div className="flex-1 p-6 overflow-auto">{children}</div>
            </main>
        </div>
    );
}
