"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import axios from "axios";

interface ModalFormProps {
  open: boolean;
  onClose: () => void;
  property: any;
  refresh: () => void;
}

export default function ModalForm({ open, onClose, property, refresh }: ModalFormProps) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    images: "",
    status: "available",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (property) {
      setForm({
        title: property.title,
        description: property.description,
        price: property.price.toString(),
        location: property.location,
        images: property.images.join(", "),
        status: property.status,
      });
    } else {
      setForm({
        title: "",
        description: "",
        price: "",
        location: "",
        images: "",
        status: "available",
      });
    }
  }, [property]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (property) {
        await axios.put(`/api/admin/properties/${property._id}`, {
          ...form,
          price: Number(form.price),
          images: form.images.split(",").map((img) => img.trim()),
        });
      } else {
        await axios.post("/api/admin/properties", {
          ...form,
          price: Number(form.price),
          images: form.images.split(",").map((img) => img.trim()),
        });
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
          <DialogTitle>{property ? "Edit Property" : "Add Property"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input placeholder="Title" name="title" value={form.title} onChange={handleChange} className="w-full border rounded-md p-2 border-l-0 border-r-0 border-t-0 border-blue-500"/>
          <Textarea placeholder="Description" name="description" value={form.description} onChange={handleChange} className="w-full border rounded-md p-2 border-l-0 border-r-0 border-t-0 border-blue-500"/>
          <Input placeholder="Price" name="price" type="number" value={form.price} onChange={handleChange} className="w-full border rounded-md p-2 border-l-0 border-r-0 border-t-0 border-blue-500"/>
          <Input placeholder="Location" name="location" value={form.location} onChange={handleChange}className="w-full border rounded-md p-2 border-l-0 border-r-0 border-t-0 border-blue-500" />
          <Input placeholder="Images (comma separated URLs)" name="images" value={form.images} onChange={handleChange} className="w-full border rounded-md p-2 border-l-0 border-r-0 border-t-0 border-blue-500"/>
          <select name="status" value={form.status} onChange={handleChange} className="w-full border rounded-md p-2 border-l-0 border-r-0 border-t-0 border-blue-500">
            <option value="available">Available</option>
            <option value="sold">Sold</option>
          </select>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
