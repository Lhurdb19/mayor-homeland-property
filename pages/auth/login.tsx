"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation"; // updated for Next.js 13+ App Router
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signIn("credentials", { ...form, redirect: false });
      if (res?.error) {
        toast.error(
          res.error === "Email not verified"
            ? "Please verify your email first."
            : res.error
        );
      } else {
        toast.success("Logged in successfully!");
        const sessionRes = await fetch("/api/auth/session");
        const session = await sessionRes.json();

        // Redirect based on user role
        router.push(
          session.user.role === "admin" ? "/dashboard/admin" : "/dashboard/user"
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white text-black/80">
      {/* Left Image */}
      <div className="hidden lg:flex w-1/2 bg-gray-100">
        <img
          src="/office-image.avif"
          alt="Office"
          className="object-cover w-full h-full"
        />
      </div>

      {/* Login Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl text-center font-bold">
              Welcome Back
            </CardTitle>
          </CardHeader>

          <p className="px-4 text-xs text-center text-gray-700 mb-4">
            Log in to explore our features, or sign up to find the best apartments in Nigeria.
          </p>

          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Email */}
              <div className="space-y-2">
                <Label className="text-xs" htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border-b-1.5 rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0"
                />
              </div>

              {/* Password */}
              <div className="relative space-y-2">
                <Label className="text-xs" htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={handleChange}
                  className="w-full rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0"
                />
                <span
                  className="absolute right-3 top-9 cursor-pointer text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end text-sm">
                <Link
                  href="/auth/forgot"
                  className="text-blue-600 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                className="w-full text-black/70 font-bold"
                type="submit"
                disabled={loading}
              >
                {loading ? "Checking..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
