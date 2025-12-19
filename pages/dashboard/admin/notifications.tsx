"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, CheckCircle } from "lucide-react";

/* ================= TYPES ================= */
type NotificationType = "success" | "error" | "warning" | "info";

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
}

/* ============ COLOR STYLES ============ */
const borderStyles: Record<NotificationType, string> = {
  success: "border-green-500",
  error: "border-red-500",
  warning: "border-yellow-500",
  info: "border-blue-500",
};

const badgeStyles: Record<NotificationType, string> = {
  success: "bg-green-100 text-green-700",
  error: "bg-red-100 text-red-700",
  warning: "bg-yellow-100 text-yellow-800",
  info: "bg-blue-100 text-blue-700",
};

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    setLoading(true);
    const res = await axios.get("/api/notifications", {
      params: { recipientType: "admin" },
    });
    setNotifications(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    await axios.patch("/api/notifications", { id });
    fetchNotifications();
  };

  const deleteNotification = async (id: string) => {
    await axios.delete("/api/notifications", { data: { id } });
    fetchNotifications();
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Notifications</h1>
        <p className="text-sm text-muted-foreground">
          System alerts, user actions, and admin updates
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No notifications found
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map(n => (
            <Card
              key={n._id}
              className={`border-l-4 ${borderStyles[n.type]}`}
            >
              <CardHeader className="flex flex-row justify-between items-start">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Badge className={badgeStyles[n.type]}>
                      {n.type}
                    </Badge>
                    {n.title}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>

                {!n.read && <Badge variant="outline">Unread</Badge>}
              </CardHeader>

              <CardContent className="space-y-3">
                <p className="text-sm">{n.message}</p>

                <div className="flex gap-2">
                  {!n.read && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => markAsRead(n._id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Mark as read
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteNotification(n._id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
