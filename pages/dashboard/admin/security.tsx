"use client";

import UserProfileLayout from "@/components/user/UserProfileLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import AdminLayout from "@/components/admin/AdminLayout";

export default function SecuritySettings() {
  const [saving, setSaving] = useState(false);
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
    } catch {
      toast.error("Error updating password");
    }
    setSaving(false);
  };

  return (
    <AdminLayout>

      <div className="max-w-2xl min-h-screen p-6 bg-muted/40 mx-auto justify-start items-center">

        <div className="p-6 rounded-xl bg-blue-600 text-white mb-6 ">
          <h1 className="text-2xl font-semibold">Security</h1>
          <p className="text-sm opacity-80">Keep your account secure</p>
        </div>

        <div className="max-w-5xl mx-auto space-y-6">

          <Card className="w-1/1">
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

              <div className="space-y-2">
                <Label>Old Password</Label>
                <Input
                  type="password"
                  value={form.oldPassword}
                  onChange={e => setForm({ ...form, oldPassword: e.target.value })}
                  className="border-l-0 border-r-0 border-t-0 border-b-2 border-b-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label>New Password</Label>
                <Input
                  type="password"
                  value={form.newPassword}
                  onChange={e => setForm({ ...form, newPassword: e.target.value })}
                  className="border-l-0 border-r-0 border-t-0 border-b-2 border-b-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label>Confirm New Password</Label>
                <Input
                  type="password"
                  value={form.confirmPassword}
                  onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                  className="border-l-0 border-r-0 border-t-0 border-b-2 border-b-blue-500"
                />
              </div>

              <Button
                className="w-full font-bold text-gray-50 bg-blue-600 hover:bg-blue-700"
                onClick={submit}
                disabled={saving}
              >
                {saving ? "Saving..." : "Update Password"}
              </Button>

            </CardContent>
          </Card>

        </div>
      </div>
    </AdminLayout>
  );
}
