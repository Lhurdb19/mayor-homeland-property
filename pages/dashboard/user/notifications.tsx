// app/dashboard/user/notifications/page.tsx
"use client";

import { useEffect, useState } from "react";
import UserProfileLayout from "@/components/user/UserProfileLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface Notification {
  _id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function UserNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications/user"); // fetch only user notifications
      if (!res.ok) throw new Error("Failed to fetch notifications");
      const data: Notification[] = await res.json();
      setNotifications(data);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Could not load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: "PUT" });
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
      toast.success("Marked as read");
    } catch (err) {
      toast.error("Failed to update notification");
    }
  };

  return (
    <UserProfileLayout>
      <div className="min-h-screen w-full p-0 sm:p-6 transition-all text-black/80">

        <div className="max-w-3xl mx-auto space-y-4 sm:space-y-8">

          <h1 className="text-xl font-bold mb-6">Notifications</h1>

          {loading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-md" />
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <p className="text-gray-500 text-sm">No notifications yet.</p>
          ) : (
            <div className="space-y-4">
              {notifications.map((n) => (
                <Card
                  key={n._id}
                  className={`p-4 transition-shadow ${n.read ? "bg-gray-50" : "bg-white shadow-lg"}`}
                >
                  <CardHeader className="flex justify-between items-start">
                    <CardTitle className="text-lg font-semibold">{n.title}</CardTitle>
                    {!n.read && (
                      <button
                        onClick={() => markAsRead(n._id)}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Mark as read
                      </button>
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </UserProfileLayout>
  );
}
