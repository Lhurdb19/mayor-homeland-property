"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface UserType {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  isVerified: boolean;
}

interface UserModalFormProps {
  open: boolean;
  onClose: () => void;
  user: UserType | null;
  refresh: () => void;
}

export default function UserModalForm({ open, onClose, user, refresh }: UserModalFormProps) {
  const [form, setForm] = useState<UserType>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    role: "user",
    isVerified: false,
  });
  const [loading, setLoading] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        role: user.role || "user",
        isVerified: user.isVerified || false,
      });
    } else {
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        role: "user",
        isVerified: false,
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.address) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);
      if (user) {
        // Edit existing user
        await axios.put(`/api/admin/users/${user._id}`, form);
        toast.success("User updated successfully");
      } else {
        // Create new user
        if (!form.password) {
          toast.error("Password is required for new users");
          setLoading(false);
          return;
        }
        await axios.post("/api/admin/users", form);
        toast.success("User created successfully");
      }
      refresh();
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{user ? "Edit User" : "Add User"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 mt-2">
          <Input
            placeholder="First Name"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            className="rounded-md p-2 border-l-0 border-r-0 border-t-0 border-blue-500"
          />
          <Input
            placeholder="Last Name"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            className="rounded-md p-2 border-l-0 border-r-0 border-t-0 border-blue-500"
          />
          <Input
            placeholder="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="rounded-md p-2 border-l-0 border-r-0 border-t-0 border-blue-500"
          />
          <Input
            placeholder="Phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="rounded-md p-2 border-l-0 border-r-0 border-t-0 border-blue-500"
          />
          <Input
            placeholder="Address"
            name="address"
            value={form.address}
            onChange={handleChange}
            className="rounded-md p-2 border-l-0 border-r-0 border-t-0 border-blue-500"
          />

          {!user && (
            <Input
              placeholder="Password"
              type="password"
              name="password"
              value={(form as any).password || ""}
              onChange={handleChange}
              className="rounded-md p-2 border-l-0 border-r-0 border-t-0 border-blue-500"
            />
          )}

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="rounded px-2 py-1 w-full p-2 border-l-0 border-r-0 border-t-0 border-blue-500"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isVerified"
              checked={form.isVerified}
              onChange={handleChange}
              id="verified"
              className="rounded-md p-2 border-l-0 border-r-0 border-t-0 border-blue-500"
            />
            <label htmlFor="verified" className="text-sm font-medium">
              Verified
            </label>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : user ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
