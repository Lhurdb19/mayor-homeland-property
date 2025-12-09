// components/admin/Sidebar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const links = [
    { name: "Dashboard", href: "/admin" },
    { name: "Users", href: "/admin/users" },
    { name: "Properties", href: "/admin/properties" },
    { name: "Transactions", href: "/admin/transactions" },
    { name: "Settings", href: "/admin/settings" },
  ];

  return (
    <aside className="w-64 bg-white shadow-md fixed h-full top-0 left-0">
      <div className="p-6 text-xl font-bold border-b">🏡 Admin Panel</div>
      <ul className="mt-6 space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`block p-3 rounded hover:bg-blue-50 ${
                pathname === link.href ? "bg-blue-100 font-bold" : ""
              }`}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
