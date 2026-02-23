"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { Mail, MapPin, Phone } from "lucide-react";
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

    // Live validation
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

    const getInputBorderClass = (field: string) => (field && errors[field] ? "border-red-500" : "");

    if (status === "loading") return <p className="text-center py-16">Loading...</p>;

    return (
        <div className="max-w-8xl w-full mx-auto py-20 px-5 md:px-20 flex flex-col items-center gap-5 text-black/80 bg-white">
            
            <h2 className="text-black/70 text-2xl lg:text-4xl lg:pt-10">Contact Us</h2>
            <div className="flex flex-col lg:flex-row gap-10">
                <div className="flex-1 flex flex-col gap-2 lg-gap-5 justify-start shadow-lg p-4 rounded-xl">
                <h1 className="text-xl md:text-4xl font-bold text-center text-black/80">Get in Touch with Us</h1>
                <p className="text-gray-600 text-sm lg:text-xl">
                    Have a question or want to discuss your property needs? Send us a message and we'll get back to you promptly.
                </p>
                    
                    <div className="flex items-center gap-3 mt-10 text-gray-700 text-sm md:text-base">
                        <MapPin className="text-blue-500" size={22} />
                        <span className="text-[12px] lg:text-xl">Amodu Tijani Cl, Victoria Island, Lagos 106104, Nigeria</span>
                    </div>

                    <div className="flex items-center gap-3 text-gray-700 text-sm md:text-base">
                        <Mail className="text-blue-500" size={20} />
                        <span className="text-[12px] lg:text-xl">mubarakshittu411@gmail.com</span>
                    </div>

                    <div className="flex items-center gap-3 text-gray-700 text-sm md:text-base">
                        <Phone className="text-blue-500" size={20} />
                        <span className="text-[12px] lg:text-xl">+234 816 836 3469</span>
                    </div>

                    <WhatsAppButton title="Property" />
                </div>

                <div className="flex-1">
                    <Card className="shadow-xl rounded-2xl py-6 px-2 md:px-0">
                        <CardHeader>
                            <CardTitle className="text-2xl font-semibold text-black/90 p-0">Send a Message</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-5 p-0 m-0">
                            <div className="relative">
                                <Input
                                    placeholder="Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={`pl-2 text-black/80 px-2 rounded-md border border-gray-200 focus-border-0 outline-none text-sm ${getInputBorderClass("name")}`}
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>

                            <div className="relative">
                                <Input
                                    placeholder="Email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`pl-2 text-black/80 px-4 rounded-md border border-gray-200 focus-border-0 outline-none text-sm ${getInputBorderClass("email")}`}
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>

                            <div className="relative">
                                <Input
                                    placeholder="Phone (optional)"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className={`pl-2 text-black/80 px-4 rounded-md border border-gray-200 focus-border-0 outline-none text-sm ${getInputBorderClass("phone")}`}
                                />
                                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                            </div>

                            <div className="relative">
                                <Textarea
                                    placeholder="Your message..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className={`h-28 text-black/80 pl-2 px-4 rounded-md border border-gray-200 focus:border-0 outline-none text-sm ${getInputBorderClass("message")}`}
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

            </div>
        </div>
    );
}
