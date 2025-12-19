"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import Link from "next/link";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { Wallet, Heart, Bell, Home, ArrowUpRight, HomeIcon } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { useWallet } from "@/hooks/useWallet";


interface Notification {
  _id: string;
  title: string;
  message: string;
  read: boolean;
}

export default function UserDashboard() {
  const { data: session } = useSession();
  const user = session?.user;

  const [totalSpent, setTotalSpent] = useState<number | null>(null);
  const [favoritesCount, setFavoritesCount] = useState<number | null>(null);
  const [propertiesCount, setPropertiesCount] = useState<number | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // const { data: session } = useSession();
  // const user = session?.user;

  const userId = user?.id;
  const { balance, loading: walletLoading } = useWallet(userId);


  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [favRes, propRes, notifRes] = await Promise.all([
          axios.get("/api/favorites/user"),
          axios.get("/api/properties/user"),
          axios.get("/api/notifications/user"),
        ]);

        setFavoritesCount(favRes.data.length);
        setPropertiesCount(propRes.data.length);
        setNotifications(notifRes.data.slice(0, 4));

        setTotalSpent(180000);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* TOP BAR */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-white top-0 z-10">
        <h1 className="text-lg font-semibold">Dashboard Overview</h1>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] px-1.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </Button>

          {/* AVATAR WITH ONLINE + NOTIFICATION */}
          <div className="relative">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>

            {/* ONLINE DOT */}
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 border-2 border-white rounded-full" />
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4 max-w-6xl mx-auto space-y-6">

        {/* USER INFO HEADER */}
        <Card className="border-none overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-5 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-md">

              {/* LEFT */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-14 w-14 bg-white text-blue-600 font-semibold">
                    <AvatarFallback className="text-xl">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>

                  {/* ONLINE */}
                  <span className="absolute bottom-1 right-1 h-3 w-3 bg-green-500 border-2 border-white rounded-full" />

                  {/* NOTIFICATION */}
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] px-1.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>

                <div>
                  <h2 className="text-lg md:text-2xl font-semibold leading-tight">
                    {user?.name || "User"}
                  </h2>

                  <div className="flex items-center gap-2 mt-1">
                    <Badge className="bg-white text-blue-600 hover:bg-white">
                      Verified
                    </Badge>
                    <span className="text-xs text-blue-100">Online</span>
                  </div>
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex flex-col text-sm gap-1 text-blue-100">
                <p>
                  <span className="font-medium text-white">Last Login:</span>{" "}
                  {user?.lastLogin
                    ? new Date(user.lastLogin).toLocaleString()
                    : "Just now"}
                </p>

                <p>
                  <span className="font-medium text-white">Recent Activity:</span>{" "}
                  Active
                </p>
              </div>

            </div>
          </CardContent>
        </Card>


        {/* OVERVIEW CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* WALLET */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Wallet Balance</CardTitle>
              <Wallet className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              {walletLoading ? (
                <Skeleton className="h-6 w-24" />
              ) : (
                <p className="text-xl font-bold">₦{balance?.toLocaleString()}</p>
              )}
            </CardContent>

          </Card>

          {/* TOTAL SPENT */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Total Spent</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              {loading ? <Skeleton className="h-6 w-24" /> : (
                <p className="text-2xl font-bold">₦{totalSpent?.toLocaleString()}</p>
              )}
            </CardContent>
          </Card>

          {/* FAVORITES */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Favorites</CardTitle>
              <Heart className="h-4 w-4 text-pink-600" />
            </CardHeader>
            <CardContent>
              {loading ? <Skeleton className="h-6 w-10" /> : (
                <p className="text-2xl font-bold">{favoritesCount}</p>
              )}
            </CardContent>
          </Card>

          {/* PROPERTIES */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">My Properties</CardTitle>
              <Home className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              {loading ? <Skeleton className="h-6 w-10" /> : (
                <p className="text-2xl font-bold">{propertiesCount}</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* SECOND ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* RECENT NOTIFICATIONS */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Recent Notifications</CardTitle>
              <Link
                href="/dashboard/user/notifications"
                className="text-sm text-blue-600 hover:underline"
              >
                View all
              </Link>
            </CardHeader>

            <CardContent className="space-y-3">
              {loading ? (
                <>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-3/4" />
                </>
              ) : notifications.length === 0 ? (
                <p className="text-sm text-muted-foreground">No notifications yet.</p>
              ) : (
                notifications.map((n) => (
                  <div key={n._id} className="flex items-start justify-between border-b pb-2 last:border-none">
                    <div>
                      <p className="font-medium text-sm">{n.title}</p>
                      <p className="text-xs text-muted-foreground">{n.message}</p>
                    </div>
                    {!n.read && (
                      <Badge className="bg-blue-600 text-white text-xs">New</Badge>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* QUICK ACTIONS */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full justify-between">
                <Link href="/dashboard/user/add-property">
                  Add Property <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>

              <Button asChild className="w-full justify-between">
                <Link href="/dashboard/user/favorites">
                  View Favorites <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>

              <Button asChild className="w-full justify-between shadow">
                <Link href="/dashboard/user/profiles/edit">
                  Edit Profile <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>

              <Button asChild className="w-full bg-blue-600 text-white hover:text-black/70 justify-between mb-2 md:mb-0">
                <Link href="/">
                  Back to Home <ArrowUpRight className="h-4 w-4"/>
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
