"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

const ResetPassword = () => {
  const router = useRouter();
  const { token } = router.query; // token from URL
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!token) return;
  }, [token]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!token) return toast.error("Invalid token");
    setLoading(true);

    try {
      await axios.post("/api/auth/reset", { token, password });
      toast.success("Password reset successfully!");
      router.push("/auth/login");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-white text-black/80">
      {/* Left Image */}
      <div className="hidden lg:flex w-1/2 bg-gray-100">
        <img src="/office-image.avif" alt="Office" className="object-cover w-full h-full" />
      </div>

      {/* Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl md:text-3xl text-center font-bold">Reset Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="relative space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10 rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0"
                />
                <span
                  className="absolute right-3 top-7.5 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </div>

              <Button className="w-full font-bold" type="submit" disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
