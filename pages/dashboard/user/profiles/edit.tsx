"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import UserProfileLayout from "@/components/user/UserProfileLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { User, Mail, Phone, MapPin } from "lucide-react";

export default function EditPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Fetch user info
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await axios.get("/api/users/profile");
        setUser(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  if (loading) return <p className="p-6 text-center">Loading...</p>;

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await axios.put("/api/users/profile", {
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        address: user.address,
      });
      setUser(res.data);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile.");
    }
    setSaving(false);
  };

  return (
    <UserProfileLayout>
      <div className="min-h-screen p-4 md:px-6 bg-gray-50 space-y-4">

        {/* HEADER */}
        <div className="flex items-center justify-between bg-linear-to-r from-blue-500 to-indigo-600 p-4 md:p-6 rounded-lg shadow-md text-white">
          <div>
            <h1 className="text-xl md:text-3xl font-bold">Edit Profile</h1>
            <p className="text-xs md:text-base">Update your personal information</p>
          </div>
        </div>

        {/* TABS */}
        <Tabs defaultValue="personal" className="space-y-4">
          <TabsList className="grid grid-cols-4 w-full border-b bg-white text-black/80 shadow">
            <TabsTrigger className="flex items-center gap-1" value="personal">
              <User className="w-5 h-5" />
              <span className="hidden md:inline">Personal Info</span>
            </TabsTrigger>

            <TabsTrigger className="flex items-center gap-1" value="account">
              <Mail className="w-5 h-5" />
              <span className="hidden md:inline">Account</span>
            </TabsTrigger>

            <TabsTrigger className="flex items-center gap-1" value="privacy">
              <Phone className="w-5 h-5" />
              <span className="hidden md:inline">Privacy</span>
            </TabsTrigger>

            <TabsTrigger className="flex items-center gap-1" value="activities">
              <MapPin className="w-5 h-5" />
              <span className="hidden md:inline">Activities</span>
            </TabsTrigger>
          </TabsList>

          {/* PERSONAL INFO */}
          <TabsContent value="personal">
            <Card className="p-4">
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input
                    value={user.firstName}
                    onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                    className="rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input
                    value={user.lastName}
                    onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                    className="rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={user.phone || ""}
                    onChange={(e) => setUser({ ...user, phone: e.target.value })}
                    className="rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input
                    value={user.address || ""}
                    onChange={(e) => setUser({ ...user, address: e.target.value })}
                    className="rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label>Email (not editable)</Label>
                  <Input disabled value={user.email} className="rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0"/>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full md:w-auto mt-4"
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </TabsContent>

          {/* ACCOUNT */}
          <TabsContent value="account">
            <p className="text-gray-700">Account-related settings go here.</p>
          </TabsContent>

          {/* PRIVACY */}
          <TabsContent value="privacy">
            <p className="text-gray-700">Privacy settings go here.</p>
          </TabsContent>

          {/* ACTIVITIES */}
          <TabsContent value="activities">
            <p className="text-gray-700">Recent activities go here.</p>
          </TabsContent>
        </Tabs>
      </div>
    </UserProfileLayout>
  );
}
