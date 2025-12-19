// components/admin/Navbar.tsx
"use client";
import { signOut, useSession } from "next-auth/react";
import NotificationBell from "./NotificationBell";



export default function AdminNavbar() {
   

  const { data: session } = useSession();
  return (
    <header className="flex justify-between p-4 bg-white shadow-md sticky top-0 z-10">

       <NotificationBell recipientType="admin"/>

      <div className="flex items-center space-x-4">
        {session ? (
          <>
            <span>{session.user?.email}</span>
            <button
              className="bg-red-600 text-white px-3 py-1 rounded"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              Logout
            </button>
          </>
        ) : null}
      </div>
    </header>
  );
}
