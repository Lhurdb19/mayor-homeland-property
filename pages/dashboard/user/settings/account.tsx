"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import axios from "axios";
import UserProfileLayout from "@/components/user/UserProfileLayout";

export default function AccountSettingsPage() {
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrImage, setQrImage] = useState("");
  const [secret, setSecret] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Load 2FA status on mount
  useEffect(() => {
    axios.get("/api/users/2fa/status").then((res) => {
      setTwoFAEnabled(res.data.twoFAEnabled);
    });
  }, []);

  // Enable 2FA - fetch secret & QR
  const handleEnable2FA = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("/api/users/2fa/setup");
      setQrImage(res.data.qr);
      setSecret(res.data.secret);
      setShowQRModal(true); // Show modal only during setup
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Verify 2FA code
  const handleVerify2FA = async () => {
    try {
      const res = await axios.post("/api/users/2fa/verify", {
        token: verifyCode,
        secret,
      });

      if (res.status === 200) {
        setTwoFAEnabled(true);
        setShowQRModal(false);
        setVerifyCode("");
        alert("Two-factor authentication enabled!");
      }
    } catch (err) {
      alert("Invalid verification code");
    }
  };

  // Disable 2FA
  const handleDisable2FA = async () => {
    try {
      await axios.put("/api/users/2fa/disable");
      setTwoFAEnabled(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <UserProfileLayout>
      <div className="max-w-3xl mx-auto p-6">
        <Card className="shadow-md border rounded-xl">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Account Security Settings
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">
                  Two-Factor Authentication (2FA)
                </h3>
                <p className="text-sm text-gray-500 max-w-sm">
                  Protect your account using Google Authenticator codes.
                </p>
              </div>

              <Switch
                checked={twoFAEnabled}
                onCheckedChange={(value) => {
                  if (value) handleEnable2FA();
                  else handleDisable2FA();
                }}
                disabled={isLoading}
              />
            </div>

            <div className="mt-3">
              {twoFAEnabled ? (
                <p className="text-green-600 font-medium">2FA is enabled.</p>
              ) : (
                <p className="text-red-600 font-medium">2FA is disabled.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* QR Modal only shows during setup */}
        <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
          <DialogTrigger className="hidden" />
         <DialogContent className="w-full max-w-xs sm:max-w-sm p-4 sm:p-6">
  <DialogHeader>
    <DialogTitle className="text-base sm:text-lg">Enable Two-Factor Authentication</DialogTitle>
  </DialogHeader>

  <div className="flex flex-col items-center gap-2 sm:gap-4 mt-2 w-full">
    {qrImage && (
      <Image
        src={qrImage}
        alt="QR Code"
        width={140}
        height={140}
        className="border rounded-lg"
      />
    )}

    <div className="w-full">
      <p className="text-xs sm:text-sm text-gray-500">Secret Key:</p>
      <p className="font-mono text-center text-xs sm:text-sm bg-gray-100 p-1 sm:p-2 rounded break-all">
        {secret}
      </p>
    </div>

    <Input
      value={verifyCode}
      onChange={(e) => setVerifyCode(e.target.value)}
      placeholder="Enter 6-digit code"
      maxLength={6}
      className="text-xs sm:text-sm"
    />

    <Button className="w-full text-xs sm:text-sm" onClick={handleVerify2FA}>
      Verify & Enable
    </Button>
  </div>
</DialogContent>

        </Dialog>
      </div>
    </UserProfileLayout>
  );
}
