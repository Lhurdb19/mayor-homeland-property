"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Bell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface NotificationType {
  _id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

export default function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    await axios.put(`/api/notifications/${id}`);
    fetchNotifications();
  };

  return (
    <div className="relative">
      <button onClick={fetchNotifications} className="relative">
        <Bell size={24} />
        {notifications.filter(n => !n.read).length > 0 && (
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        )}
      </button>
      <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-auto bg-white shadow-lg rounded-md z-50">
        <Card className="p-2">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {loading ? (
              <p>Loading...</p>
            ) : notifications.length === 0 ? (
              <p>No notifications</p>
            ) : (
              notifications.map((n) => (
                <div key={n._id} className={`p-2 border rounded ${n.read ? "bg-gray-100" : "bg-white"}`}>
                  <Link href={n.link || "#"} className="block">
                    <h3 className="font-semibold">{n.title}</h3>
                    <p>{n.message}</p>
                    <p className="text-xs text-gray-500">{new Date(n.createdAt).toLocaleString()}</p>
                  </Link>
                  {!n.read && (
                    <Button size="xs" variant="outline" onClick={() => markAsRead(n._id)}>
                      Mark as Read
                    </Button>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
