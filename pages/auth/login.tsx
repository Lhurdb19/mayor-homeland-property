"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signIn("credentials", { ...form, redirect: false });
      if (res?.error) {
        toast.error(res.error === "Email not verified" ? "Please verify your email first." : res.error);
      } else {
        toast.success("Logged in successfully!");
        const sessionRes = await fetch("/api/auth/session");
        const session = await sessionRes.json();
        router.push(session.user.role === "admin" ? "/dashboard/admin" : "/dashboard/user");
      }
    } catch (err) {
      toast.error("Something went wrong.");
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Image */}
      <div className="hidden lg:flex w-1/2 bg-gray-100">
        <img src="/office-image.avif" alt="Office" className="object-cover w-full h-full" />
      </div>

      {/* Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl text-center font-bold">Welcome Back</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className=" space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div className="relative space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={handleChange}
                  className="pr-10"
                />
                <span
                  className="absolute right-3 top-7.5 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </div>

              <div className="flex justify-end text-sm">
                <Link href="/auth/forgot" className="text-blue-600 hover:underline">
                  Forgot Password?
                </Link>
              </div>

              <Button className="w-full text-black font-bold" type="submit" disabled={loading}>
                {loading ? "Checking..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
