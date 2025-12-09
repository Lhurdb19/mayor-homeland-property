"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ForgotPassword() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/auth/forgot", { email });
      toast.success("Password reset link sent! Check your email.");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex w-1/2 bg-gray-100">
        <img src="/office-image.avif" alt="Office" className="object-cover w-full h-full" />
      </div>

      <div className="flex w-full lg:w-1/2 items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl md:text-3xl text-center font-bold">Forgot Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <Button className="w-full" type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
