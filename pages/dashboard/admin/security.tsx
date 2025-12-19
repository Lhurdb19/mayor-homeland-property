"use client";

import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Check } from "lucide-react";

export default function SecuritySettings() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const submit = async () => {
    if (form.newPassword !== form.confirmPassword)
      return toast.error("Passwords do not match");

    setSaving(true);
    try {
      await axios.put("/api/admin/change-password", form);
      toast.success("Password updated!");
      setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setSaved(true);

      // Auto hide success state after 3s
      setTimeout(() => setSaved(false), 3000);
    } catch {
      toast.error("Error updating password");
    }
    setSaving(false);
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Security Settings</h1>
          <p className="text-gray-600 text-sm">
            Keep your account secure by updating your password regularly.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Password Form / Success */}
          <div className="md:col-span-2 space-y-4">
            {saved ? (
              <Card className="w-full bg-green-50 border-green-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <Check className="w-5 h-5" /> Password Updated
                  </CardTitle>
                  <CardDescription>Your password has been successfully updated.</CardDescription>
                </CardHeader>
              </Card>
            ) : (
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your password to maintain account security.</CardDescription>
                </CardHeader>

                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="old-password">Old Password</Label>
                    <Input
                      id="old-password"
                      type="password"
                      placeholder="Enter your old password"
                      value={form.oldPassword}
                      onChange={(e) => setForm({ ...form, oldPassword: e.target.value })}
                      className="w-full border-b-1.5 rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="Enter a new password"
                      value={form.newPassword}
                      onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                      className="w-full border-b-1.5 rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm your new password"
                      value={form.confirmPassword}
                      onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                      className="w-full border-b-1.5 rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0"
                    />
                  </div>

                  <Button onClick={submit} disabled={saving} className="w-full mt-2">
                    {saving ? "Saving..." : "Update Password"}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column: Security Tips */}
          <div className="space-y-5">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Security Tips</CardTitle>
                <CardDescription>
                  Important practices to keep your account safe.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3 text-sm text-gray-700">
                <ul className="list-disc pl-5 space-y-2">
                  <li>Use a strong and unique password for your account.</li>
                  <li>Enable two-factor authentication if available.</li>
                  <li>Do not share your password with anyone.</li>
                  <li>Change your password regularly for enhanced security.</li>
                  <li>Log out of your account on shared devices.</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
