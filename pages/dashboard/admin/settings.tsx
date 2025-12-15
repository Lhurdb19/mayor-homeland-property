"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner"; // <-- import Sonner toast

interface SiteSettings {
  commissionRate: number;
  featuredListings: boolean;
  darkMode: boolean;
  whatsappNumbers: string[];  // ← ADD THIS
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);

  const [adminData, setAdminData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });

  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    commissionRate: 5,
    featuredListings: true,
    darkMode: false,
    whatsappNumbers: ["2348168363469"],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const adminRes = await axios.get("/api/admin/me");
        const settingsRes = await axios.get("/api/admin/settings");

        setAdminData({
          firstName: adminRes.data.firstName || "",
          lastName: adminRes.data.lastName || "",
          email: adminRes.data.email || "",
          phone: adminRes.data.phone || "",
          password: "",
        });

        setSiteSettings({
          commissionRate: settingsRes.data.commissionRate ?? 5,
          featuredListings: settingsRes.data.featuredListings ?? true,
          darkMode: settingsRes.data.darkMode ?? false,
          whatsappNumbers: settingsRes.data.whatsappNumbers || ["2348168363469"], // ✅ use array
        });

      } catch (err) {
        console.error(err);
        toast.error("Failed to load settings");
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      await axios.put("/api/admin/me", adminData);
      await axios.put("/api/admin/settings", siteSettings);
      toast.success("Settings updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update settings");
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {loading ? (
        <div className="space-y-6">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : (
        <>
          {/* Admin Profile */}
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Admin Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                placeholder="First Name"
                value={adminData.firstName}
                onChange={(e) => setAdminData({ ...adminData, firstName: e.target.value })}
              />
              <Input
                placeholder="Last Name"
                value={adminData.lastName}
                onChange={(e) => setAdminData({ ...adminData, lastName: e.target.value })}
                className="rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0"
              />
              <Input
                placeholder="Email"
                value={adminData.email}
                onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
                className="rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0"
              />
              <Input
                placeholder="Phone"
                value={adminData.phone}
                onChange={(e) => setAdminData({ ...adminData, phone: e.target.value })}
                className="rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0"
              />
              <Input
                type="password"
                placeholder="Password (leave blank to keep current)"
                onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
                className="rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0"
              />
            </CardContent>
          </Card>

          {/* Site Settings */}
          <Collapsible>
            <CollapsibleTrigger className="mb-2 font-semibold">Site Settings</CollapsibleTrigger>
            <CollapsibleContent className="space-y-3">
              <Input
                type="number"
                placeholder="Commission Rate"
                value={siteSettings.commissionRate}
                onChange={(e) =>
                  setSiteSettings({ ...siteSettings, commissionRate: Number(e.target.value) })
                }
                className="rounded-md p-2 border-l-0 border-r-0 border-t-0 border-blue-500"
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={siteSettings.featuredListings}
                  onChange={(e) =>
                    setSiteSettings({ ...siteSettings, featuredListings: e.target.checked })
                  }
                  className="rounded-md p-2 border-l-0 border-r-0 border-t-0 border-blue-500"
                />
                Featured Listings Enabled
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={siteSettings.darkMode}
                  onChange={(e) =>
                    setSiteSettings({ ...siteSettings, darkMode: e.target.checked })
                  }
                  className="rounded-md p-2 border-l-0 border-r-0 border-t-0 border-blue-500"
                />
                Dark Mode
              </label>

              <h3 className="font-semibold mt-4">WhatsApp Agents</h3>

              {siteSettings.whatsappNumbers.map((num, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={num}
                    onChange={(e) => {
                      const list = [...siteSettings.whatsappNumbers];
                      list[index] = e.target.value;
                      setSiteSettings({ ...siteSettings, whatsappNumbers: list });
                    }}
                    className="rounded-md p-2 border-l-0 border-r-0 border-t-0 border-blue-500"
                  />
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setSiteSettings({
                        ...siteSettings,
                        whatsappNumbers: siteSettings.whatsappNumbers.filter((_, i) => i !== index),
                      });
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}

              <Button
                className="mt-2"
                onClick={() =>
                  setSiteSettings({
                    ...siteSettings,
                    whatsappNumbers: [...siteSettings.whatsappNumbers, ""],
                  })
                }
              >
                + Add Agent Number
              </Button>
            </CollapsibleContent>
          </Collapsible>

          {/* Save Button */}
          <Button className="mt-4" onClick={handleSave}>
            Save Settings
          </Button>
        </>
      )}
    </AdminLayout>
  );
}
