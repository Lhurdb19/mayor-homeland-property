"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import WhatsAppButton from "./WhatsAppButton";

interface VisitFormProps {
  propertyId: string;
}

export default function VisitForm({ propertyId }: VisitFormProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post("/api/admin/inquiries", {
        name: form.name,
        email: form.email,
        phone: form.phone,
        propertyId,
        message: `
Visit Date: ${form.date || "Not selected"}
Message: ${form.message || "No message"}
        `,
      });

      toast.success("Visit request submitted!");

      setForm({
        name: "",
        email: "",
        phone: "",
        date: "",
        message: "",
      });

    } catch (error) {
      toast.error("Failed to submit visit request.");
    }
  };

  return (
    <Card className="mb-6 shadow-md dark:bg-gray-700 dark:text-gray-800">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Schedule a Visit</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">

          <Input
            type="text"
            name="name"
            placeholder="Your Name"
            required
            value={form.name}
            onChange={handleChange}
          />

          <Input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            value={form.email}
            onChange={handleChange}
          />

          <Input
            type="text"
            name="phone"
            placeholder="Phone Number"
            required
            value={form.phone}
            onChange={handleChange}
          />

          <Input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
          />

          <Textarea
            name="message"
            placeholder="Message (optional)"
            value={form.message}
            onChange={handleChange}
          />

          <Button type="submit" className="w-full">
            Submit Request
          </Button>
          <WhatsAppButton title="Property Visit Inquiry" />
        </form>
      </CardContent>
    </Card>
  );
}
