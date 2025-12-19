// hooks/useNotifications.ts
"use client";

import { useEffect, useState } from "react";

export function useNotifications() {
  const [count, setCount] = useState(0);

  const fetchCount = async () => {
    const res = await fetch("/api/notifications/unread-count");
    const data = await res.json();
    setCount(data.count || 0);
  };

  useEffect(() => {
    fetchCount();

    const interval = setInterval(fetchCount, 30000); // 🔁 every 30s
    return () => clearInterval(interval);
  }, []);

  return { count, refetchNotifications: fetchCount };
}
