"use client";

import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import axios from "axios";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Property {
  _id?: string;
  title?: string;
  description?: string;
  price?: number;
  location?: string;
  latitude?: number;
  longitude?: number;
  type?: string;
  status?: string;
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number;
  phone?: string;
  email?: string;
  images?: string[];
}

interface Props {
  open: boolean;
  onClose: () => void;
  property?: Property | null;
  refresh: () => void;
}

export default function PropertyModalForm({
  open,
  onClose,
  property,
  refresh,
}: Props) {
  const { register, reset, setValue, watch, handleSubmit } = useForm<any>();
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (property) {
      reset(property);
      setPreviewImages(property.images || []);
    } else {
      reset();
      setPreviewImages([]);
    }
  }, [property, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setPreviewImages((prev) => [...prev, base64]);
        setValue("images", [...previewImages, base64]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const updated = previewImages.filter((_, i) => i !== index);
    setPreviewImages(updated);
    setValue("images", updated);
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      property
        ? await axios.put(`/api/admin/properties/${property._id}`, data)
        : await axios.post(`/api/admin/properties`, data);

      refresh();
      onClose();
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-black">
            {property ? "Edit Property" : "Add Property"}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[80vh] px-6 pb-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2 text-black">
                <Label className="text-black">Title</Label>
              <Input {...register("title", { required: true })} 
              className="w-full border-b-1.5 rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0"
              />
            </div>

            <div className="space-y-2 text-black">
                <Label className="text-black">Description</Label>
              <Textarea {...register("description", { required: true })} 
              className="w-full border-b-1.5 rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 text-black">
              <div className="space-y-2">
                <Label className="text-black">Price</Label>
                <Input type="number" {...register("price")} 
                className="w-full border-b-1.5 rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-black">Location</Label>
                <Input {...register("location")} 
                className="w-full border-b-1.5 rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0"
                />
              </div>
            </div>

            <div className="w-full grid grid-cols-2 gap-4">
              <Select
                defaultValue={property?.status || "available"}
                onValueChange={(v) => setValue("status", v)}
              >
                <SelectTrigger className="w-full text-black border-b-1.5 rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                  <SelectItem value="rented">Rented</SelectItem>
                </SelectContent>
              </Select>

              <Select
                defaultValue={property?.type || "sale"}
                onValueChange={(v) => setValue("type", v)}
              >
                <SelectTrigger className="w-full border-b-1.5 rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0 text-black">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sale">Sale</SelectItem>
                  <SelectItem value="rent">Rent</SelectItem>
                  <SelectItem value="lease">Lease</SelectItem>
                  <SelectItem value="land">Land</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Input type="file" multiple accept="image/*" onChange={handleFileChange} 
            className="w-full text-black placeholder:text-black border-b-1.5 rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0"
            />

            <div className="grid grid-cols-3 gap-3">
              {previewImages.map((img, i) => (
                <div key={i} className="relative">
                  <img src={img} className="h-24 w-full object-cover rounded" />
                  <Button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-black/70 text-white px-2 rounded"
                  >
                    ✕
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : property ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
