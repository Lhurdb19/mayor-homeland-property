"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
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

  const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/auth/register", form);
      toast.success("Account created successfully! Check your email to verify.");
      router.push("/auth/check-email");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Something went wrong");
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
      <div className="flex w-full lg:w-1/2 items-center justify-center p-2 mt-20">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl md:text-3xl text-center font-bold">Create an Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-2" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" name="firstName" value={form.firstName} onChange={handleChange} required className="border-l-0 border-r-0 border-t-0 border-blue-500 " />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" name="lastName" value={form.lastName} onChange={handleChange} required className="border-l-0 border-r-0 border-t-0 border-blue-500 " />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required className="border-l-0 border-r-0 border-t-0 border-blue-500 " />
              </div>
              <div className="relative space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="border-l-0 border-r-0 border-t-0 border-blue-500"
                />
                <span
                  className="absolute right-3 top-7.5 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" type="text" value={form.phone} onChange={handleChange} placeholder="e.g. 08012345678" required className="border-l-0 border-r-0 border-t-0 border-blue-500 " />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" name="address" type="text" value={form.address} onChange={handleChange} required className="border-l-0 border-r-0 border-t-0 border-blue-500 " />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Select Role</Label>
                <select id="role" name="role" value={form.role} onChange={handleChange} className="w-full border rounded-md p-2 border-l-0 border-r-0 border-t-0 border-blue-500">
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="text-end flex justify-end">

              <Button className="w-[150px] text-end flex items-end font-bold" type="submit" disabled={loading}>
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
