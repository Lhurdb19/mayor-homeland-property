"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, CheckCircle, XCircle, Edit, User, Mail, Phone, MapPin, ShieldCheck } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import UserProfileLayout from "@/components/user/UserProfileLayout";

export default function UserProfilePage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

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

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
      </div>
    );

  if (!user)
    return <p className="py-8 text-center">Unable to load profile.</p>;

  return (
    <UserProfileLayout>
      <div className="min-h-screen p-0 md:p-6  text-black dark:text-white">
        <div className="max-w-6xl lg:max-w-5xl xl:max-w-3xl w-full mx-auto space-y-2 md:space-y-6">

          {/* HEADER SECTION */}
          <div className="flex items-center justify-between bg-linear-to-r from-blue-400 to-indigo-600 p-3 md:p-6 rounded-lg shadow-md">
            <div>
              <h1 className="text-xl md:text-3xl font-bold tracking-tight">My Profile</h1>
              <p className="text-white text-xs md:text-base">
                Manage your personal information
              </p>
            </div>

            <Link href="/dashboard/user/profiles/edit">
              <Button className="flex gap-2 rounded-lg text-[8px] md:text-sm">
                <Edit className="w-4 h-4" />
                Edit Profile
              </Button>
            </Link>
          </div>

          {/* PROFILE CARD */}
          <Card className="border rounded-2xl shadow-sm bg-blue-500">
            <CardContent className="p-2 md:p-6 flex flex-col md:flex-row gap-3 md:gap-6">

              {/* Avatar */}
              <div className="flex flex-col items-center text-center">
                <Image
                  src={user.image || "/avatar-placeholder.png"}
                  alt="Profile Photo"
                  width={120}
                  height={120}
                  className="rounded-full border-4 border-blue-200 object-cover shadow-md w-20 h-20 md:w-32 md:h-32"
                />
              </div>

              {/* Info */}
              <div className="flex-1">
                <h2 className="text-lg md:text-2xl font-semibold">
                  {user.firstName} {user.lastName}
                </h2>

                <div className="mt-2">
                  {user.isVerified ? (
                    <Badge className="bg-blue-600 text-white text-[10px] md:text-xs px-3 py-1 flex items-center gap-1 rounded-full">
                      <CheckCircle className="w-4 h-4" /> Verified
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="flex items-center text-[10px] md:text-xs gap-1 px-3 py-1 rounded-full">
                      <XCircle className="w-4 h-4" /> Unverified
                    </Badge>
                  )}
                </div>

                <p className="text-gray-200 text-[11px] md:text-lg mt-4 leading-relaxed max-w-lg">
                  Your profile contains personal, contact, and account details linked to your registration.
                </p>
              </div>

            </CardContent>
          </Card>

          {/* DETAILS CARD - INDIVIDUAL MINI CARDS */}
          <div className="space-y-4 grid grid-cols-1 md:grid-cols-3 gap-4">

            <Card className="shadow-sm border">
              <CardContent className="flex items-center gap-3 py-4">
                <User className="text-blue-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Full Name</p>
                  <p className="font-medium text-sm text-gray-600">{user.firstName} {user.lastName}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border ">
              <CardContent className="flex items-center gap-3 py-0">
                <Mail className="text-blue-600 w-5 h-10" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium text-gray-700 break-after-auto break-all text-sm">{user.email}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border">
              <CardContent className="flex items-center gap-3 py-4">
                <Phone className="text-blue-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone Number</p>
                  <p className="font-medium text-sm text-gray-600">{user.phone || "Not provided"}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border">
              <CardContent className="flex items-center gap-3 py-4">
                <MapPin className="text-blue-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Address</p>
                  <p className="font-medium text-sm text-gray-600">{user.address || "No address added"}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border">
              <CardContent className="flex items-center gap-3 py-4">
                <ShieldCheck className="text-blue-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Account Created</p>
                  <p className="font-medium text-sm text-gray-600">{format(new Date(user.createdAt), "PPP")}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border">
              <CardContent className="flex items-center gap-3 py-4">
                <ShieldCheck className="text-blue-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Last Updated</p>
                  <p className="font-medium text-sm text-gray-600">{format(new Date(user.updatedAt), "PPP")}</p>
                </div>
              </CardContent>
            </Card>

          </div>

        </div>
      </div>
    </UserProfileLayout>
  );
}
