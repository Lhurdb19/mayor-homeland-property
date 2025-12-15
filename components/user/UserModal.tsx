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
  password?: string;
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
    password: "",
  });

  const [loading, setLoading] = useState(false);

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
        password: "",
      });
    }
  }, [user]);

  // FIXED TYPE NARROWING
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target;

    let value: any = target.value;

    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      value = target.checked;
    }

    setForm((prev) => ({
      ...prev,
      [target.name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.address) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);

      if (user) {
        await axios.put(`/api/admin/users/${user._id}`, form);
        toast.success("User updated successfully");
      } else {
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
          <Input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} className="rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0"/>
          <Input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} className="rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0"/>
          <Input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0"/>
          <Input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} className="rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0"/>
          <Input name="address" placeholder="Address" value={form.address} onChange={handleChange} className="rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0"/>

          {!user && (
            <Input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0"
            />
          )}

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0"
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
              className="rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0"
            />
            <label className="text-sm font-medium">Verified</label>
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
