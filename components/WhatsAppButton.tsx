"use client";
import { useEffect, useState } from "react";

export default function WhatsAppButton({ title }: { title: string }) {
  const [numbers, setNumbers] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      setNumbers(data.whatsappNumbers || []);
    };
    load();
  }, []);

  if (!numbers.length) return null;

  return (
    <div className="relative mt-3">
      {/* Main Button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-bold hover:bg-green-700"
      >
        💬 Chat With an Agent
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute w-full bg-white shadow-lg border rounded-lg mt-2 z-10">
          {numbers.map((num, idx) => (
            <a
              key={idx}
              href={`https://wa.me/${num}?text=Hello, I’m interested in the property: ${title}`}
              target="_blank"
              className="block px-4 py-2 hover:bg-gray-100"
            >
              Agent {idx + 1} — {num}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
