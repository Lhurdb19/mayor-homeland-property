"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";

/* ================= TYPES ================= */
type NotificationType = "success" | "error" | "warning" | "info";

interface Notification {
  _id: string;
  title: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
}

/* ============ COLOR STYLES ============ */
const notificationStyles: Record<NotificationType, string> = {
  success: "bg-green-100 text-green-700",
  error: "bg-red-100 text-red-700",
  warning: "bg-yellow-100 text-yellow-800",
  info: "bg-blue-100 text-blue-700",
};

export default function NotificationBell({
  recipientType,
  recipientId,
}: {
  recipientType: "admin" | "user";
  recipientId?: string;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const fetchNotifications = async () => {
    const res = await axios.get("/api/notifications", {
      params: { recipientType, recipient: recipientId },
    });
    setNotifications(res.data);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 px-1 text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-80">
        <div className="px-3 py-2 text-sm font-semibold">
          Notifications
        </div>

        <DropdownMenuSeparator />

        {notifications.length === 0 && (
          <div className="px-3 py-6 text-center text-sm text-muted-foreground">
            No notifications
          </div>
        )}

        {notifications.slice(0, 5).map(n => (
          <DropdownMenuItem key={n._id} asChild>
            <Link
              href="/dashboard/admin/notifications"
              className="flex flex-col gap-1"
            >
              <div className="flex items-center gap-2">
                <Badge className={notificationStyles[n.type]}>
                  {n.type}
                </Badge>
                <span className="font-medium">{n.title}</span>
              </div>

              <span className="text-xs text-muted-foreground">
                {new Date(n.createdAt).toLocaleString()}
              </span>
            </Link>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link
            href="/dashboard/admin/notifications"
            className="text-center text-sm font-medium w-full"
          >
            View all notifications
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
