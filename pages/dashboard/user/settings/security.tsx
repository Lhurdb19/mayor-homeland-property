"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import UserProfileLayout from "@/components/user/UserProfileLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Edit, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function SecuritySettingsUnified() {
  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [savingPassword, setSavingPassword] = useState(false);

  // 2FA state
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [qrImage, setQrImage] = useState("");
  const [secret, setSecret] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [isLoading2FA, setIsLoading2FA] = useState(false);

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Load user profile
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await axios.get("/api/users/profile");
        setUser(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  // Load 2FA status
  useEffect(() => {
    axios.get("/api/users/2fa/status").then((res) => {
      setTwoFAEnabled(res.data.twoFAEnabled);
    });
  }, []);

  // Password change
  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return toast.error("Passwords do not match");
    }
    setSavingPassword(true);
    try {
      await axios.put("/api/users/change-password", passwordForm);
      toast.success("Password updated!");
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch {
      toast.error("Error updating password");
    }
    setSavingPassword(false);
  };

  // Enable 2FA
  const handleEnable2FA = async () => {
    try {
      setIsLoading2FA(true);
      const res = await axios.get("/api/users/2fa/setup");
      setQrImage(res.data.qr);
      setSecret(res.data.secret);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading2FA(false);
    }
  };

  // Verify 2FA
  const handleVerify2FA = async () => {
    try {
      await axios.post("/api/users/2fa/verify", { token: verifyCode, secret });
      setTwoFAEnabled(true);
      setQrImage("");
      setVerifyCode("");
      toast.success("Two-factor authentication enabled!");
    } catch {
      toast.error("Invalid verification code");
    }
  };

  // Disable 2FA
  const handleDisable2FA = async () => {
    try {
      await axios.put("/api/users/2fa/disable");
      setTwoFAEnabled(false);
      toast.success("Two-factor authentication disabled");
    } catch {
      toast.error("Error disabling 2FA");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <span className="animate w-8 h-8 block text-black/80 rounded-full"> Loading...</span>
    </div>
  );

  if (!user) return <p className="py-8 text-center">Unable to load profile.</p>;

  return (
    <UserProfileLayout>
      <div className="max-w-4xl mx-auto min-h-screen p-6 space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between bg-linear-to-r from-blue-500 to-indigo-600 p-4 md:p-6 rounded-lg shadow-md text-white">
          <div>
            <h1 className="text-xl md:text-3xl font-bold">Security Settings</h1>
            <p className="text-xs md:text-base">Manage your password and two-factor authentication</p>
          </div>
          <Link href="/dashboard/user/profiles/edit">
            <Button className="flex gap-2 text-[8px] md:text-sm">
              <Edit className="w-4 h-4" /> Edit Profile
            </Button>
          </Link>
        </div>

        {/* TABS */}
        <Tabs defaultValue="password" className="space-y-4">
          <TabsList className="grid grid-cols-2 w-full gap-10 border-b mb-4 bg-white shadow-lg">
            <TabsTrigger value="password">Change Password</TabsTrigger>
            <TabsTrigger value="2fa">Two-Factor Auth</TabsTrigger>
          </TabsList>

          {/* Password Tab */}
          <TabsContent value="password" className="space-y-4">
            <div className="space-y-2">
              <Label>Old Password</Label>
              <Input
                type="password"
                value={passwordForm.oldPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, oldPassword: e.target.value })
                }
                className="rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0"
              />
            </div>
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                }
                className="rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0"
              />
            </div>
            <div className="space-y-2">
              <Label>Confirm New Password</Label>
              <Input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                }
                className="rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0"
              />
            </div>
            <Button onClick={handlePasswordChange} disabled={savingPassword} className="w-full">
              {savingPassword ? "Saving..." : "Update Password"}
            </Button>
          </TabsContent>

          {/* 2FA Tab */}
          <TabsContent value="2fa" className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-700 max-w-sm">
                Protect your account using Google Authenticator codes.
              </p>
              <Switch
                checked={twoFAEnabled}
                onCheckedChange={(value) => {
                  if (value) handleEnable2FA();
                  else handleDisable2FA();
                }}
                disabled={isLoading2FA}
              />
            </div>
            <p className={`text-sm font-medium ${twoFAEnabled ? "text-green-600" : "text-red-600"}`}>
              {twoFAEnabled ? "2FA is enabled" : "2FA is disabled"}
            </p>

            {/* QR Section */}
            {qrImage && (
              <div className="flex flex-col items-center gap-4 mt-4">
                <Image src={qrImage} alt="QR Code" width={140} height={140} className="border rounded-lg" />
                <div className="w-full text-center">
                  <p className="text-xs text-gray-500">Secret Key:</p>
                  <p className="font-mono text-xs bg-gray-100 p-2 rounded break-all">{secret}</p>
                </div>
                <Input
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  className="text-xs w-full"
                />
                <Button onClick={handleVerify2FA} className="w-full">
                  Verify & Enable
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </UserProfileLayout>
  );
}
