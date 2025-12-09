"use client";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function DeleteAccountPage() {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete your account?")) return;

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
    <div className="max-w-lg mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4 text-red-600">Delete Account</h1>
      <p className="text-gray-700 mb-6">
        This action is permanent and cannot be undone. All your data will be removed.
      </p>

      <Button variant="destructive" onClick={handleDelete}>
        Delete My Account
      </Button>
    </div>
  );
}
