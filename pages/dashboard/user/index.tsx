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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Home,
  Heart,
  Bell,
  CheckCircle,
  XCircle,
  PlusCircle,
  User,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import UserProfileLayout from "@/components/user/UserProfileLayout";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Notification {
  _id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export default function UserDashboard() {
  const { data: session } = useSession();
  const user = session?.user;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);

  const [propertiesCount, setPropertiesCount] = useState<number | null>(null);
  const [favoritesCount, setFavoritesCount] = useState<number | null>(null);

  // Dummy chart data for analytics
  const [propertyAnalytics, setPropertyAnalytics] = useState<number[]>([5, 8,  7, 15, 10, 15, 20]);

  useEffect(() => {
    const loadNotifications = async () => {
      setLoadingNotifications(true);
      try {
        const res = await axios.get("/api/notifications/user");
        setNotifications(res.data.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingNotifications(false);
      }
    };

    const loadCounts = async () => {
      try {
        const propsRes = await axios.get("/api/properties/user");
        setPropertiesCount(propsRes.data.length);

        const favRes = await axios.get("/api/favorites/user");
        setFavoritesCount(favRes.data.length);
      } catch (err) {
        console.error(err);
      }
    };

    loadNotifications();
    loadCounts();
  }, []);

  const chartData = {
    labels: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Properties Added",
        data: propertyAnalytics,
        backgroundColor: "rgba(59, 130, 246, 0.7)", // Tailwind blue-500
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Properties Analytics",
      },
    },
  };

  return (
    <UserProfileLayout>
      <div className="min-h-screen w-full bg-white text-black/80 p-0 sm:p-6 transition-all">
        <div className="max-w-3xl mx-auto space-y-4 sm:space-y-8">

          {/* HOME CARD */}
          <Card className="bg-white py-2 md:p-5 shadow-md hover:shadow-lg transition">
            <CardHeader className="flex items-start justify-between">
              <CardTitle className="text-sm sm:text-xl font-bold dark:text-gray-700">
                Landing Page
              </CardTitle>
              <Link
                href="/"
                className="text-blue-600 font-medium hover:underline flex items-center gap-1 text-xs sm:text-base"
              >
                <Home className="w-4 h-4 sm:w-5 sm:h-5" /> Go Home
              </Link>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-center md:text-start sm:text-base text-gray-700">
                Click the button to return to the main landing page.
              </p>
            </CardContent>
          </Card>

          {/* WELCOME CARD */}
          <Card className="bg-linear-to-r from-blue-600 to-indigo-800 text-white p-4 sm:p-7 shadow-lg">
            <h1 className="text-lg sm:text-3xl font-bold">
              Welcome, {user?.name || "User"} 👋
            </h1>
            <p className="text-xs sm:text-base opacity-90 mt-0 sm:mt-2">
              Here's a quick overview of your account activities.
            </p>
            <div className="mt-0 sm:mt-4">
              {user?.isVerified ? (
                <Badge className="bg-green-600 flex items-center gap-1 text-xs sm:text-sm">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" /> Verified Account
                </Badge>
              ) : (
                <Badge className="bg-red-600 flex items-center gap-1 text-xs sm:text-sm">
                  <XCircle className="w-3 h-3 sm:w-4 sm:h-4" /> Not Verified
                </Badge>
              )}
            </div>
          </Card>

          {/* ANALYTICS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1 sm:gap-6">
            {/* Properties */}
            <Card className="py-1 sm:p-2 m-0 flex text-start ">
              <CardHeader className="flex items-center gap-2">
                <Home className="sm:w-5 sm:h-5 text-blue-600" />
                <CardTitle className="text-xs sm:text-lg font-semibold">Properties</CardTitle>
              </CardHeader>
              <CardContent className="mt-0 sm:mt-4">
                <p className="text-md sm:text-3xl font-bold">{propertiesCount ?? "..."}</p>
                <Badge className="mt-0 sm:mt-2 bg-blue-600 text-white text-[10px] sm:text-sm">Active Listings</Badge>
              </CardContent>
            </Card>

            {/* Favorites */}
            <Card className="p-2 sm:p-5 m-0">
              <CardHeader className="flex items-center gap-2 m-0">
                <Heart className="sm:w-10 sm:h-5 text-pink-600" />
                <CardTitle className="text-xs sm:text-lg font-semibold">Favorites</CardTitle>
              </CardHeader>
              <CardContent className="mt-0 sm:mt-4">
                <p className="text-lg sm:text-3xl font-bold">{favoritesCount ?? "..."}</p>
                <Badge className="mt-0 sm:mt-2 bg-pink-600 text-white text-[10px] sm:text-sm">Saved Homes</Badge>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="p-2 sm:p-5">
              <CardHeader className="flex items-center gap-2">
                <Bell className="sm:w-5 sm:h-5 text-yellow-600" />
                <CardTitle className="text-xs sm:text-lg font-semibold">Notifications</CardTitle>
              </CardHeader>
              <CardContent className="mt-0 sm:mt-4">
                <p className="text-lg sm:text-3xl font-bold">{notifications.length}</p>
                <Badge className="mt-0 sm:mt-2 bg-yellow-600 text-white text-[10px] sm:text-sm">Unread</Badge>
              </CardContent>
            </Card>

            {/* Verification Status */}
            <Card className="p-2 sm:p-5">
              <CardHeader className="flex items-center gap-2">
                <User className="w-3 h-3 sm:w-5 sm:h-5 text-green-600" />
                <CardTitle className="text-xs sm:text-lg font-semibold">Status</CardTitle>
              </CardHeader>
              <CardContent className="mt-2 sm:mt-4">
                <p className="text-lg sm:text-xl font-bold">{user?.isVerified ? "Verified" : "Unverified"}</p>
                {user?.isVerified ? (
                  <Badge className="bg-green-600 text-white flex items-center gap-1 mt-1 sm:mt-2 text-[10px] sm:text-sm">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" /> Verified
                  </Badge>
                ) : (
                  <Badge className="bg-red-600 text-white flex items-center gap-1 mt-1 sm:mt-2 text-xs sm:text-sm">
                    <XCircle className="w-3 h-3 sm:w-4 sm:h-4" /> Not Verified
                  </Badge>
                )}
              </CardContent>
            </Card>
          </div>

          {/* PROPERTIES ANALYTICS */}
          <Card className="p-3 sm:p-5 w-full hidden md:block">
            <CardHeader>
              <CardTitle className="text-sm sm:text-lg">Properties Analytics</CardTitle>
            </CardHeader>
            <CardContent className="w-full">
              <div className="w-full h-50 sm:h-80"> {/* Control height */}
                <Bar
                  data={chartData}
                  options={{
                    ...chartOptions,
                    maintainAspectRatio: false, // crucial for mobile
                  }}
                />
              </div>
            </CardContent>
          </Card>


          {/* QUICK ACTIONS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            <Card className="p-3 sm:p-6 hover:shadow-lg transition">
              <CardTitle className="text-sm sm:text-lg font-semibold">Add Property</CardTitle>
              <CardContent className="mt-2 sm:mt-3">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  List a new property for buyers or renters.
                </p>
                <Link
                  href="/dashboard/user/add-property"
                  className="inline-flex mt-2 sm:mt-3 items-center gap-1 sm:gap-2 text-blue-600 font-medium text-xs sm:text-sm hover:underline"
                >
                  <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5" /> Add Now
                </Link>
              </CardContent>
            </Card>

            <Card className="p-3 sm:p-6 hover:shadow-lg transition">
              <CardTitle className="text-sm sm:text-lg font-semibold">Edit Profile</CardTitle>
              <CardContent className="mt-2 sm:mt-3">
                <p className="text-xs sm:text-sm text-muted-foreground">Update your personal information.</p>
                <Link
                  href="/dashboard/user/profile"
                  className="inline-flex mt-2 sm:mt-3 items-center gap-1 sm:gap-2 text-blue-600 font-medium text-xs sm:text-sm hover:underline"
                >
                  <User className="w-4 h-4 sm:w-5 sm:h-5" /> View Profile
                </Link>
              </CardContent>
            </Card>

            <Card className="p-3 sm:p-6 hover:shadow-lg transition">
              <CardTitle className="text-sm sm:text-lg font-semibold">View Favorites</CardTitle>
              <CardContent className="mt-2 sm:mt-3">
                <p className="text-xs sm:text-sm text-muted-foreground">Access saved properties anytime.</p>
                <Link
                  href="/dashboard/user/favorites"
                  className="inline-flex mt-2 sm:mt-3 items-center gap-1 sm:gap-2 text-blue-600 font-medium text-xs sm:text-sm hover:underline"
                >
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5" /> View List
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </UserProfileLayout>
  );
}
