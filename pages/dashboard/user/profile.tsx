"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, CheckCircle, XCircle, Edit } from "lucide-react";
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
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );

  if (!user)
    return <p className="p-8 text-center">Unable to load profile.</p>;

  return (
    <UserProfileLayout>

    <div className="min-h-screen bg-muted/40 p-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="text-muted-foreground">Manage your personal information</p>
          </div>

          <Link href="/dashboard/user/settings">
            <Button className="flex gap-2">
              <Edit className="w-4 h-4" />
              Edit Profile
            </Button>
          </Link>
        </div>

        {/* TOP CARD */}
        <Card>
          <CardContent className="p-6 flex flex-col md:flex-row gap-6">
            {/* AVATAR */}
            <div className="flex flex-col items-center">
              <Image
                src={user.image || "/avatar-placeholder.png"}
                alt="Profile Photo"
                width={110}
                height={110}
                className="rounded-full border shadow"
              />
            </div>

            {/* NAME & BADGE */}
            <div className="flex-1">
              <h2 className="text-2xl font-semibold">
                {user.firstName} {user.lastName}
              </h2>

              <div className="mt-2">
                {user.isVerified ? (
                  <Badge className="bg-green-600 text-white flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> Verified Account
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <XCircle className="w-4 h-4" /> Unverified
                  </Badge>
                )}
              </div>

              <p className="mt-4 text-muted-foreground max-w-md">
                Your profile contains personal and contact details linked to your account.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* DETAILS CARD */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Account Information</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">

            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">{user.firstName} {user.lastName}</p>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-muted-foreground">Phone Number</p>
                <p className="font-medium">{user.phone}</p>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">{user.address}</p>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-muted-foreground">Account Created</p>
                <p className="font-medium">
                  {format(new Date(user.createdAt), "PPP")}
                </p>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="font-medium">
                  {format(new Date(user.updatedAt), "PPP")}
                </p>
              </div>

            </div>
          </CardContent>
        </Card>

      </div>
    </div>
    </UserProfileLayout>
  );
}
