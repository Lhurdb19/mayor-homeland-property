// app/dashboard/user/notifications/page.tsx
"use client";

import { useEffect, useState } from "react";
import UserProfileLayout from "@/components/user/UserProfileLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications/user");
      if (!res.ok) throw new Error("Failed to fetch notifications");
      const data: Notification[] = await res.json();
      setNotifications(data);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Could not load notifications");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: "PUT" });
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      toast.success("Marked as read");
    } catch {
      toast.error("Failed to update notification");
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications/user/mark-all-read", { method: "PUT" });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to mark all as read");
    }
  };

  return (
    <UserProfileLayout>
      <div className="min-h-screen w-full pt-18 sm:p-6 text-black/80 space-y-6">

        <div className="flex items-center justify-between bg-linear-to-r from-blue-500 to-indigo-600 p-4 md:p-6 rounded-lg shadow-md text-white">
          <div>
            <h1 className="text-xl md:text-3xl font-bold">Notifications</h1>
            <p className="text-xs md:text-base">View and manage your notifications</p>
          </div>
          <Button onClick={markAllAsRead} size="sm" className="text-xs md:text-sm bg-white text-blue-500 p-1">
            Mark all as read
          </Button>
        </div>

        <div className="max-w-8xl mx-auto space-y-4">
          {notifications.length === 0 ? (
            <p className="text-gray-500 text-sm">No notifications yet.</p>
          ) : (
            notifications.map((n) => (
              <Card
                key={n._id}
                className={`p-4 transition-shadow ${n.read ? "bg-gray-50" : "bg-white shadow-lg"}`}
              >
                <CardHeader className="flex justify-between items-start">
                  <CardTitle className="text-lg font-semibold">{n.title}</CardTitle>
                  {!n.read && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => markAsRead(n._id)}
                      className="text-xs"
                    >
                      Mark as read
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-gray-600 text-sm lg:text-xl">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </UserProfileLayout>
  );
}
