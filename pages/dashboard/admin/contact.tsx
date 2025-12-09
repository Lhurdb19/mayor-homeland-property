"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { useEffect, useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BsCheck, BsCheckAll } from "react-icons/bs";

interface Contact {
  _id: string;
  name: string;
  email: string;
  userId: string;
  message: string;
  adminResponse?: string;
  createdAt: string;
  updatedAt?: string;
}

export default function AdminContactPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [reply, setReply] = useState<string>("");
  const [replyToContactId, setReplyToContactId] = useState<string | null>(null); // _id for sending reply

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadContacts = async () => {
    try {
      const res = await fetch("/api/contact/get");
      const data = await res.json();
      setContacts(data.data || []);
      scrollToBottom();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadContacts();
    const interval = setInterval(loadContacts, 3000); // auto-refresh every 3s
    return () => clearInterval(interval);
  }, []);

  const handleReply = async () => {
    if (!replyToContactId || !reply.trim()) return toast.error("Reply cannot be empty");

    try {
      const res = await fetch("/api/contact/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contactId: replyToContactId, message: reply }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Reply sent successfully");
      setReply("");
      loadContacts();
    } catch (err: any) {
      toast.error(err.message);
    }
  };


  // Unique users
  const users = Array.from(new Map(contacts.map(c => [c.userId, c])).values());

  return (
    <AdminLayout>
      <div className="flex max-w-6xl mx-auto py-12 gap-6 h-[80vh]">
        {/* User List */}
        <div className="w-1/3 overflow-y-auto border-r border-gray-200 rounded-lg">
          <h2 className="text-xl font-bold mb-4 px-3">Users</h2>
          <div className="space-y-2 px-2">
            {users.map((user) => (
              <div
                key={user.userId}
                className={`cursor-pointer p-3 rounded-md ${selectedUser === user.userId ? "bg-blue-100 border-blue-600 border" : "bg-white border-gray-200 border"
                  } shadow-sm`}
                onClick={() => {
                  setSelectedUser(user.userId); // for filtering messages
                  const latestContact = contacts.filter(c => c.userId === user.userId).pop();
                  setReplyToContactId(latestContact?._id || null); // for reply
                }}
              >
                <p className="font-semibold">{user.name}</p>
                <p className="text-gray-500 text-sm truncate">{user.email}</p>
                <p className="text-gray-700 mt-1 truncate">{user.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Box */}
        <div className="w-2/3 flex flex-col bg-white dark:bg-[#111B21] rounded-lg border dark:border-gray-800">
          {selectedUser ? (
            <>
              <div className="flex-1 p-3 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-700">
                {contacts
  .filter(c => c.userId === selectedUser)
  .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  .map((c) => (
    <div key={c._id} className="space-y-3">
      {c.sender === "user" ? (
        <div className="flex justify-end items-end bg-green-500">
          <div className="bg-green-500 text-white px-3 py-2 rounded-lg max-w-[75%] shadow-md">
            {c.message}
            <div className="text-[10px] opacity-70 mt-1">
              {new Date(c.createdAt).toLocaleTimeString()}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-start items-start">
          <div className="bg-blue-500 text-white px-3 py-2 rounded-lg max-w-[75%] shadow-md">
            {c.message}
            <div className="text-[10px] opacity-70 mt-1">
              {new Date(c.createdAt).toLocaleTimeString()}
            </div>
          </div>
        </div>
      )}
    </div>
  ))
}

                <div ref={chatEndRef} />
              </div>

              {/* Reply Input */}
              <div className="p-3 flex items-center gap-2 bg-gray-100 dark:bg-[#1F2C33]">
                <Textarea
                  placeholder="Type a reply..."
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  className="flex-1 h-16 resize-none text-sm rounded-md p-2 border-l-0 border-r-0 border-t-0 border-blue-500"
                />
                <Button onClick={handleReply} className="bg-blue-600 text-white hover:bg-blue-700 rounded-full px-4">
                  Send
                </Button>
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-center mt-20">Select a user to view messages</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
