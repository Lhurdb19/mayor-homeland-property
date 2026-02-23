"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
// import { PickerStyles } from "emoji-mart";
import { BsEmojiSmile, BsCheck, BsCheckAll } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import UserProfileLayout from "@/components/user/UserProfileLayout";

export default function UserContactPage() {
  const { data: session } = useSession();

  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load Messages
  const loadContacts = async () => {
    if (!session?.user) return;
    try {
      setLoading(true);
      const res = await fetch("/api/contact/user");
      const data = await res.json();
      setContacts(data.data || []);
      scrollToBottom();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, [session]);

  // Typing Indicator
  const handleTyping = (value: string) => {
    setMessage(value);
    setTyping(true);

    setTimeout(() => setTyping(false), 1000);
  };

  // Send Message
  const handleSendMessage = async () => {
    if (!message.trim()) return toast.error("Message cannot be empty");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: session?.user?.name || "Guest",
          email: session?.user?.email || "",
          message,
          userId: session?.user?.id || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success("Message sent!");
      setMessage("");
      loadContacts();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <UserProfileLayout>
      <div className="flex flex-col w-full max-w-8xl mx-auto pt-18 md:py-10 px-2 md:px-0">

        <h1 className="text-2xl font-bold mb-4">Your Messages</h1>

        <div
          className="
          flex flex-col h-[70vh] md:h-[75vh] 
          bg-white dark:bg-[#111B21] 
          border dark:border-gray-800 
          rounded-lg overflow-hidden"
        >
          <div
            className="
            flex-1 p-2 overflow-y-auto 
            space-y-4 scrollbar-thin 
            scrollbar-thumb-gray-400 
            dark:scrollbar-thumb-gray-700"
          >
            {loading ? (
              <>
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </>
            ) : contacts.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 mt-20">
                No messages yet
              </p>
            ) : (
              contacts
                .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                .map((c) => (
                  <div key={c._id} className="space-y-3">

                    {c.sender === "user" ? (
                      <div className="flex justify-end">
                        <div className="
              bg-[#005C4B] text-white 
              px-2 py-1 rounded-lg 
              max-w-[75%] shadow-md 
              whitespace-pre-wrap break-words text-sm
            ">
                          {c.message}

                          <div className="flex justify-end gap-1 text-[9px] opacity-70 mt-1">
                            {new Date(c.createdAt).toLocaleTimeString()}
                            <BsCheckAll className="text-blue-400" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      // ADMIN MESSAGE (LEFT)
                      <div className="flex justify-start">
                        <div className="
              bg-[#202C33] text-white 
              px-3 py-1 rounded-lg 
              max-w-[70%] shadow-md 
              whitespace-pre-wrap break-words text-sm
            ">
                          {c.message}

                          <div className="text-[9px] opacity-70 mt-1">
                            {new Date(c.createdAt).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
            )}

            {typing && (
              <div className="text-green-400 text-[10px] md:text-sm animate-pulse">Typing...</div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 flex items-center gap-2 bg-gray-100 dark:bg-[#1F2C33]">

            <Textarea
              placeholder="Type a message"
              value={message}
              onChange={(e) => handleTyping(e.target.value)}
              className="
                resize-none h-5
                bg-white dark:bg-[#0B141A] 
                text-gray-900 dark:text-white 
                whitespace-pre-wrap break-words break-all
                rounded-xl p-2 w-full text-[10px] text-sm"
            />

            <Button
              onClick={handleSendMessage}
              className="rounded-full h-7 md:h-12 px-3 md:px-10 text-white bg-green-600 hover:bg-green-700"
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </UserProfileLayout>
  );
}
