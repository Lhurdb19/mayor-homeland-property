"use client";

import UserProfileLayout from "@/components/user/UserProfileLayout";
import UserDashboard from "@/components/user/UserDashboard";

export default function DashboardPage() {
  return (
    <UserProfileLayout>
      <UserDashboard />
    </UserProfileLayout>
  );
}
