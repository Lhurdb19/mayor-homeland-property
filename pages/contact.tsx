"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { Mail, MapPin, Phone, } from "lucide-react";
import Image from "next/image";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function ContactPage() {
    const { data: session, status } = useSession();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (session?.user) {
            setName(session.user.name || "");
            setEmail(session.user.email || "");
        }
    }, [session]);

    // Validate inputs live
    useEffect(() => {
        const newErrors: { [key: string]: string } = {};
        if (name && name.length < 3) newErrors.name = "Name must be at least 3 characters";
        if (email && !/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Invalid email address";
        if (phone && !/^\+?\d{7,15}$/.test(phone)) newErrors.phone = "Invalid phone number";
        if (message && message.length < 10) newErrors.message = "Message must be at least 10 characters";
        setErrors(newErrors);
    }, [name, email, phone, message]);

    const handleSubmit = async () => {
        if (!name || !email || !message) return toast.error("Please fill all required fields");
        if (Object.keys(errors).length > 0) return toast.error("Please fix the errors before submitting");

        try {
            setLoading(true);
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, phone, message, userId: session?.user?.id }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            toast.success("Message sent! Check your email for confirmation.");
            setMessage("");
            setPhone("");
        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getInputBorderClass = (field: string) => {
        if (!field) return "";
        return errors[field] ? "border-red-500" : "border-green-500";
    };

    if (status === "loading") return <p className="text-center py-16">Loading...</p>;

    return (
        <div className="max-w-8xl w-full flex justify-center py-20 px-0 lg:py-0 bg-white text-black/80">
                {/* Office Info */}
                <Image width={800} height={600}
                    src="/office-image.avif"
                    alt="Office"
                    className="hidden md:block border border-gray-200 shadow-md mt-4 w-2/3 h-auto object-cover"
                />

            <div className="h-auto flex flex-col py-0 md:py-20">
            <h1 className="text-xl md:text-3xl font-bold text-center mb-0 lg:mb-0">Contact Us</h1>


                {/* Contact Form */}
                <Card className=" w-1/1 md:1/1 shadow-xl rounded-2xl py-6 md:pr-16">
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3 text-xs md:text-xs text-gray-700">
                            <MapPin className="text-blue-500" size={25} />
                            <span className="text-xs md:text-[12px]"> Amodu Tijani Cl, Victoria Island, Lagos 106104, Lagos, Nigeria</span>
                        </div>
                        <div className="flex items-center text-xs md:text-[12px] gap-3 text-gray-700">
                            <Mail className="text-blue-500" size={17} />
                            <span>mubarakshittu411@gmail.com</span>
                        </div>
                        <div className="flex items-center text-xs md:text-[12px] gap-3 text-gray-700">
                            <Phone className="text-blue-500" size={17}/>
                            <span>+234 816 836 3469</span>
                        </div>

                        <WhatsAppButton title="Property"/>

                    </CardContent>
                    <CardHeader>
                        <CardTitle className="text-xl md:text-xl mt-10 text-black/90 font-semibold">Send a Message</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <div className="relative ">
                            <Input
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className={`pl-2 text-black/80 text-xs border-l-0 border-t-0 border-b-2 border-r-0 border-blue-500 md:text-sm ${getInputBorderClass("name")}`}
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>

                        <div className="relative">
                            <Input
                                placeholder="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`pl-2 text-black/80 text-xs md:text-sm border-l-0 border-t-0 border-b-2 border-r-0 border-blue-500 ${getInputBorderClass("email")}`}
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>

                        <div className="relative">
                            <Input
                                placeholder="Phone (optional)"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className={`pl-2 text-black/80 text-xs md:text-sm border-l-0 border-t-0 border-b-2 border-r-0 border-blue-500 ${getInputBorderClass("phone")}`}
                            />
                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                        </div>

                        <div className="relative">
                            <Textarea
                                placeholder="Your message..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className={`h-30 text-black/80 pl-2 text-xs md:text-sm border-l-0 border-t-0 border-b-2 border-r-0 border-b-blue-500 ${getInputBorderClass("message")}`}
                            />
                            {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                        </div>

                        <Button
                            onClick={handleSubmit}
                            disabled={loading || Object.keys(errors).length > 0}
                            className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-200 text-white"
                        >
                            {loading ? "Sending..." : "Send Message"}
                        </Button>
                    </CardContent>
                </Card>
            </div>
{/* 
            <style jsx>{`
        input.border-red-500, textarea.border-red-500 {
          border-width: 1px !important;
        }
         {
          border-width: 1px !important;
        }
      `}</style> */}
        </div>
    );
}
