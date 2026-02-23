"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import UserProfileLayout from "@/components/user/UserProfileLayout";
import { Button } from "@/components/ui/button";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog"; // import your dialog

export default function DeleteAccountPage() {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      const res = await fetch("/api/users/delete", { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete account");

      toast.success("Account deleted successfully");
      router.push("/");
    } catch (err: any) {
      toast.error(err.message || "Could not delete account");
    }
  };

  return (
    <UserProfileLayout>
      <div className="max-w-lg min-h-screen flex flex-col items-center text-center mx-auto mt-10 bg-white">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Delete Account</h1>
        <p className="text-gray-700 text-lg mb-6">
          This action is permanent and cannot be undone. All your data will be removed.
        </p>

        <Button variant="destructive" onClick={() => setIsDialogOpen(true)}>
          Delete My Account
        </Button>

        <DeleteConfirmDialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onConfirm={handleDelete}
          title="Are you sure you want to delete your account?"
        />
      </div>
    </UserProfileLayout>
  );
}
