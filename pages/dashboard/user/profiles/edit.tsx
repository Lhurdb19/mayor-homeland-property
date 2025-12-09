"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import Image from "next/image";
import UserProfileLayout from "@/components/user/UserProfileLayout";

export default function EditPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);

  const [file, setFile] = useState<File | null>(null);
  const [previewImg, setPreviewImg] = useState("");

  // Fetch user info
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await axios.get("/api/users/profile");
        setUser(res.data);
        setPreviewImg(res.data.image || "/avatar-placeholder.png");
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

  const handleFileChange = (e: any) => {
    const img = e.target.files[0];
    if (!img) return;
    setFile(img);
    setPreviewImg(URL.createObjectURL(img));
  };

 const handleSave = async () => {
  setSaving(true);

  try {
    let imageUrl = user.image;

    // Upload avatar if file selected
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await axios.post("/api/users/upload-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      imageUrl = uploadRes.data.url;
    }

    // Send only fields you want to update
    const res = await axios.put("/api/users/profile", {
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      address: user.address,
      image: imageUrl,
    });

    setUser(res.data);
    setPreviewImg(res.data.image);
    setFile(null);

    toast.success("Profile updated successfully!");
  } catch (err) {
    console.error(err);
    toast.error("Failed to update profile.");
  }

  setSaving(false);
};

  return (
    <UserProfileLayout>
      <div className="min-h-screen bg-muted/40 py-0 flex flex-col justify-center items-center w-8xl">
        <div className="max-w-full lg:max-w-full">

          {/* MAIN CONTENT */}
          <Card className="col-span-2 w-full shadow-md border rounded-xl m-0 p-5">
            <CardHeader>
              <CardTitle className="text-md md:text-lg font-semibold">Profile Information</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6 m-0 p-0">

              {/* Avatar */}
              <div className="flex flex-col md:flex-row items-center gap-6 bg-linear-to-r from-blue-400 to-indigo-600 p-4 rounded-lg">
                <div className="relative w-24 h-24 md:w-28 md:h-28">
                  <Image
                    src={previewImg}
                    alt="Avatar"
                    fill
                    className="rounded-full  object-cover border shadow-md bg-gray-300"
                  />
                </div>

                <div className="flex-1 space-y-1">
                  <Label className="font-medium">Profile Photo</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    className="mt-2"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              {/* Editable Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs md:text-sm">First Name</Label>
                  <Input
                    value={user.firstName}
                    onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                    className="border-l-0 text-xs border-t-0 border-b-1 border-blue-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs md:text-sm">Last Name</Label>
                  <Input
                    value={user.lastName}
                    onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                    className="text-xs border-l-0 border-t-0 border-b-1 border-blue-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs md:text-sm">Phone Number</Label>
                  <Input
                    value={user.phone || ""}
                    onChange={(e) => setUser({ ...user, phone: e.target.value })}
                    className="text-xs border-l-0 border-t-0 border-b-1 border-blue-500 focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs md:text-sm">Address</Label>
                  <Input
                    value={user.address || ""}
                    onChange={(e) => setUser({ ...user, address: e.target.value })}
                    className="text-xs border-l-0 border-t-0 border-b-1 border-blue-500 focus:outline-none"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label className="text-xs md:text-sm">Email (not editable)</Label>
                  <Input disabled value={user.email} className="text-xs border-l-0 border-t-0 border-b-1 border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2 text-xs md:text-sm"
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>

            </CardContent>
          </Card>
        </div>
      </div>
    </UserProfileLayout>
  );
}
