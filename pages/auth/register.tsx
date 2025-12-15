"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; // Next.js 13+ App Router
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role: "user",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/auth/register", form);
      toast.success("Account created successfully! Check your email to verify.");
      router.push("/auth/check-email");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Something went wrong. Please try again.");
      console.error(err);
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

      {/* Registration Form */}
      <div className="flex w-full lg:w-1/2 items-center md:mt-10 py-16 justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl text-center font-bold">
              Create an Account
            </CardTitle>
          </CardHeader>

          <p className="px-4 text-xs text-center text-gray-700 mb-4">
            Register now to access our features and find the best apartments in Nigeria.
          </p>

          <CardContent>
            <form className="w-full space-y-4" onSubmit={handleSubmit}>
              <div className="w-full flex justify-between gap-5">

              <div className="space-y-2 w-full">
                <Label className="text-xs" htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  className="w-full rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0"
                />
              </div>

              {/* Last Name */}
              <div className="space-y-2 w-full">
                <Label className="text-xs" htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  className="w-full rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0"
                />
              </div>
                  </div>

                  
              <div className="w-full flex gap-5">
              <div className="space-y-2 w-full">
                <Label className="text-xs" htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2 w-full">
                <Label className="text-xs" htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="text"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="e.g. 08012345678"
                  required
                  className="rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0"
                />
              </div>
                  </div>


                  
              <div className="w-full flex gap-5">
              {/* Address */}
              <div className="space-y-2 w-full">
                <Label className="text-xs" htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  value={form.address}
                  onChange={handleChange}
                  required
                  className="rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0"
                />
              </div>

              <div className="relative space-y-2 w-full">
                <Label className="text-xs" htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0"
                  />
                <span
                  className="absolute right-3 top-9 cursor-pointer text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                  >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </div>
                  </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="w-full font-bold text-black/70"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Register"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
