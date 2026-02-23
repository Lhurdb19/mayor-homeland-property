"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Edit,
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Lock,
  Activity,
} from "lucide-react";
import UserProfileLayout from "@/components/user/UserProfileLayout";

export default function UserProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <span className="animate w-8 h-8 block text-black/80 rounded-full"> Loading...</span>
    </div>
  );

  if (!user) return <p className="py-8 text-center">Unable to load profile.</p>;

  return (
    <UserProfileLayout>
      <div className="min-h-screen px-0 py-18 md:p-4 md:px-6 bg-gray-50 space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between bg-linear-to-r from-blue-500 to-indigo-600 p-4 md:p-6 rounded-lg shadow-md text-white">
          <div>
            <h1 className="text-xl md:text-3xl font-bold">My Profile</h1>
            <p className="text-xs md:text-base">Manage your personal information</p>
          </div>
          <Link href="/dashboard/user/profiles/edit">
            <Button className="flex gap-2 text-[8px] md:text-sm bg-white text-blue-600">
              <Edit className="w-4 h-4 text-blue-600" /> Edit Profile
            </Button>
          </Link>
        </div>

        <Card className="shadow-sm border">
          <CardContent className="flex flex-col md:flex-row items-center gap-4 md:gap-6">

            <div>
              <h2 className="text-lg md:text-2xl font-semibold">{user.firstName} {user.lastName}</h2>
              {user.isVerified ? (
                <Badge className="bg-blue-600 text-white mt-1 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Verified
                </Badge>
              ) : (
                <Badge variant="destructive" className="mt-1 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Unverified
                </Badge>
              )}
              <p className="text-gray-600 mt-2">{user.email}</p>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="personal" className="space-y-4">
          <TabsList className="grid grid-cols-4 w-full border-b bg-white text-black/80 shadow">
            <TabsTrigger value="personal" className="flex items-center gap-1 text-black">
              <User className="w-5 h-5" />
              <span className="hidden md:inline">Personal Info</span>
            </TabsTrigger>

            <TabsTrigger value="account" className="flex items-center gap-1 text-black">
              <ShieldCheck className="w-5 h-5" />
              <span className="hidden md:inline">Account</span>
            </TabsTrigger>

            <TabsTrigger value="privacy" className="flex items-center gap-1 text-black">
              <Lock className="w-5 h-5" />
              <span className="hidden md:inline">Privacy</span>
            </TabsTrigger>

            <TabsTrigger value="activities" className="flex items-center gap-1 text-black">
              <Activity className="w-5 h-5" />
              <span className="hidden md:inline">Activities</span>
            </TabsTrigger>
          </TabsList>


          {/* PERSONAL INFO */}
          <TabsContent value="personal">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex items-center gap-2">
                  <User className="text-blue-600" />
                  <CardTitle className="text-sm font-semibold">Full Name</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-sm">{user.firstName} {user.lastName}</p>
                  <Badge className="mt-1 bg-blue-100 text-blue-700">Primary Info</Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex items-center gap-2">
                  <Mail className="text-blue-600" />
                  <CardTitle className="text-sm font-semibold">Email</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-sm">{user.email}</p>
                  <Badge className={`mt-1 ${user.isVerified ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                    {user.isVerified ? "Verified" : "Unverified"}
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex items-center gap-2">
                  <Phone className="text-blue-600" />
                  <CardTitle className="text-sm font-semibold">Phone</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-sm">{user.phone || "Not provided"}</p>
                  <Badge className="mt-1 bg-blue-100 text-blue-700">Contact Info</Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex items-center gap-2">
                  <MapPin className="text-blue-600" />
                  <CardTitle className="text-sm font-semibold">Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-sm">{user.address || "Not provided"}</p>
                  <Badge className="mt-1 bg-blue-100 text-blue-700">Contact Info</Badge>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ACCOUNT */}
          <TabsContent value="account">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex items-center gap-2">
                  <ShieldCheck className="text-blue-600" />
                  <CardTitle className="text-sm font-semibold">Account Created</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-sm">{format(new Date(user.createdAt), "PPP")}</p>
                  <Badge className="mt-1 bg-blue-100 text-blue-700 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Secure
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex items-center gap-2">
                  <ShieldCheck className="text-blue-600" />
                  <CardTitle className="text-sm font-semibold">Last Updated</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-sm">{format(new Date(user.updatedAt), "PPP")}</p>
                  <Badge className="mt-1 bg-blue-100 text-blue-700 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Recent
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex items-center gap-2">
                  <Mail className="text-blue-600" />
                  <CardTitle className="text-sm font-semibold">Email Verified</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-sm">{user.isVerified ? "Yes" : "No"}</p>
                  <Badge className={`mt-1 flex items-center gap-1 ${user.isVerified ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                    <ShieldCheck className="w-3 h-3" /> {user.isVerified ? "Verified" : "Unverified"}
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* PRIVACY */}
          <TabsContent value="privacy">
            <Card>
              <CardHeader className="flex items-center gap-2">
                <Lock className="text-blue-600" />
                <CardTitle className="text-sm font-semibold">Privacy Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">Control your profile visibility, data sharing, and security preferences.</p>
                <Badge className="mt-2 bg-blue-100 text-blue-700">Secure</Badge>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ACTIVITIES */}
          <TabsContent value="activities">
            <Card>
              <CardHeader className="flex items-center gap-2">
                <Activity className="text-blue-600" />
                <CardTitle className="text-sm font-semibold">Recent Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">Your recent actions, logins, and updates will appear here.</p>
                <Badge className="mt-2 bg-blue-100 text-blue-700">Activity</Badge>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </UserProfileLayout>
  );
}
