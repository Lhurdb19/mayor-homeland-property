"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";

interface UserModalFormProps {
    open: boolean;
    onClose: () => void;
    user: any;
    refresh: () => void;
}

export default function UserModalForm({ open, onClose, user, refresh }: UserModalFormProps) {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        role: "user",
        password: "",
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setForm({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
                password: "",
            });
        } else {
            setForm({ firstName: "", lastName: "", email: "", phone: "", address: "", role: "user", password: "" });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            if (user) {
                await axios.put(`/api/admin/users/${user._id}`, form);
            } else {
                await axios.post("/api/admin/users", form);
            }
            refresh();
            onClose();
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>{user ? "Edit User" : "Add User"}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <Input placeholder="First Name" name="firstName" value={form.firstName} onChange={handleChange} className="border rounded-md border-l-0 border-r-0 border-t-0 border-blue-500"/>
                    <Input placeholder="Last Name" name="lastName" value={form.lastName} onChange={handleChange} className="border rounded-md p-2 border-l-0 border-r-0 border-t-0 border-blue-500"/>
                    <Input placeholder="Email" name="email" type="email" value={form.email} onChange={handleChange} className="border rounded-md p-2 border-l-0 border-r-0 border-t-0 border-blue-500"/>
                    <Input placeholder="Phone" name="phone" value={form.phone} onChange={handleChange} className="border rounded-md p-2 border-l-0 border-r-0 border-t-0 border-blue-500"/>
                    <Input placeholder="Address" name="address" value={form.address} onChange={handleChange} className="border rounded-md p-2 border-l-0 border-r-0 border-t-0 border-blue-500"/>
                    <select name="role" value={form.role} onChange={handleChange} className="w-full border rounded-md p-2 border-l-0 border-r-0 border-t-0 border-blue-500">
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                    <p className="text-sm font-medium text-green-600">
                        {user.isVerified ? "Verified" : "Not Verified"}
                    </p>

                    {!user && <Input placeholder="Password" name="password" type="password" value={form.password} onChange={handleChange} className="border rounded-md p-2 border-l-0 border-r-0 border-t-0 border-blue-500"/>}
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" onClick={onClose}>Cancel</Button>
                        <Button onClick={handleSubmit} disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
