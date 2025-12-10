"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";

interface UserModalFormProps {
  open: boolean;
  onClose: () => void;
  user?: any; // Editing existing user
  refresh: () => void;
}

export default function UserModalForm({ open, onClose, user, refresh }: UserModalFormProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "user",
    isVerified: false,
  });

  // Fill form when editing
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      });
    } else {
      setForm({
        name: "",
        email: "",
        role: "user",
        isVerified: false,
      });
    }
  }, [user]);

  // Fix TS error: allow input + select
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);

    try {
      if (user) {
        // UPDATE USER
        await axios.put(`/api/admin/users/${user._id}`, form);
        toast.success("User updated");
      } else {
        // CREATE USER
        await axios.post("/api/admin/users", form);
        toast.success("User added");
      }

      refresh();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{user ? "Edit User" : "Add New User"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <Label>Name</Label>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter full name"
            />
          </div>

          {/* Email */}
          <div>
            <Label>Email</Label>
            <Input
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              placeholder="user@example.com"
            />
          </div>

          {/* Role */}
          <div>
            <Label>Role</Label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-md"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Verified Toggle */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="verified"
              checked={form.isVerified}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  isVerified: e.target.checked,
                }))
              }
            />
            <Label htmlFor="verified">Verified</Label>
          </div>

          {/* Submit */}
          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            {loading ? "Saving..." : user ? "Update User" : "Add User"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
