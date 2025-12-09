// components/admin/UsersTable.tsx
"use client";

import useSWR from "swr";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function UsersTable() {
  const { data, error, isLoading } = useSWR("/api/admin/users", fetcher);

  if (isLoading) return Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full mb-2 rounded" />);
  if (error) return <p>Error loading users</p>;

  return (
    <table className="w-full text-left border-collapse mt-6">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2 border">Name</th>
          <th className="p-2 border">Email</th>
          <th className="p-2 border">Role</th>
          <th className="p-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((user: any) => (
          <tr key={user._id} className="border-b">
            <td className="p-2">{user.firstName} {user.lastName}</td>
            <td className="p-2">{user.email}</td>
            <td className="p-2">{user.role}</td>
            <td className="p-2 space-x-2">
              <Button size="sm">Edit</Button>
              <Button size="sm" variant="destructive">Delete</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
