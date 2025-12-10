"use client";

import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Dynamic import of MapPicker (client-only)
const MapPicker = dynamic(() => import("../admin/MapPicker"), { ssr: false });

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

interface PropertyModalFormProps {
  open: boolean;
  onClose: () => void;
  property?: Property | null;
  refresh: () => void;
}

export default function PropertyModalForm({ open, onClose, property, refresh }: PropertyModalFormProps) {
  const { register, reset, setValue, watch, handleSubmit, formState: { errors } } = useForm<any>({
    defaultValues: {
      title: "",
      description: "",
      price: "",
      location: "",
      latitude: null,
      longitude: null,
      type: "sale",
      status: "available",
      bedrooms: "",
      bathrooms: "",
      sqft: "",
      phone: "",
      email: "",
      images: [],
    },
  });

  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (property) {
      reset({
        ...property,
        images: property.images || [],
      });
      setPreviewImages(property.images || []);
    } else {
      reset();
      setPreviewImages([]);
    }
  }, [property, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: string[] = [];

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        newImages.push(base64);
        setPreviewImages((prev) => [...prev, base64]);
        setValue("images", [...previewImages, ...newImages]);
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
      if (property) {
        await axios.put(`/api/admin/properties/${property._id}`, data);
      } else {
        await axios.post(`/api/admin/properties`, data);
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
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{property ? "Edit Property" : "Add Property"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input placeholder="Title" {...register("title", { required: true })} className="rounded-md p-2 border-l-0 border-r-0 border-t-0 border-blue-500" />
          {errors.title && <p className="text-red-500 text-xs">Title is required</p>}

          <textarea {...register("description", { required: true })} className="w-full border rounded-md p-2 border-l-0 border-r-0 border-t-0 border-blue-500" rows={3} placeholder="Description" />
          {errors.description && <p className="text-red-500 text-xs">Description is required</p>}

          <Input type="number" placeholder="Price" {...register("price", { required: true })} />

          <Input placeholder="Location" {...register("location", { required: true })} />

          {/* SELECTS */}
          <div className="grid grid-cols-2 gap-3">
            <select
              {...register("status")}
              className="border rounded p-2 w-full border-l-0 border-r-0 border-t-0 border-blue-500"
            >
              <option value="available">Available</option>
              <option value="sold">Sold</option>
              <option value="rented">Rented</option>
            </select>

            <select {...register("type")} className="border rounded p-2 w-full border-l-0 border-r-0 border-t-0 border-blue-500">
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
              <option value="lease">Lease</option>
              <option value="land">Land</option>
            </select>
          </div>

          {/* DETAILS */}
          <div className="grid grid-cols-3 gap-3">
            <Input
              type="number"
              placeholder="Bedrooms"
              {...register("bedrooms")}
              className="border rounded-md p-2 border-l-0 border-r-0 border-t-0 border-blue-500"
            />

            <Input
              type="number"
              placeholder="Bathrooms"
              {...register("bathrooms")}
              className="border rounded-md p-2 border-l-0 border-r-0 border-t-0 border-blue-500"
            />

            <Input type="number" placeholder="Sqft" {...register("sqft")} className="border rounded-md p-2 border-l-0 border-r-0 border-t-0 border-blue-500" />
          </div>

          {/* CONTACT */}
          <Input placeholder="Phone" {...register("phone")} className="border rounded-md p-2 border-l-0 border-r-0 border-t-0 border-blue-500" />
          <Input type="email" placeholder="Email" {...register("email")} className="border rounded-md p-2 border-l-0 border-r-0 border-t-0 border-blue-500" />

          <MapPicker
            value={watch("latitude") && watch("longitude") ? { lat: watch("latitude"), lng: watch("longitude") } : undefined}
            onChange={(pos) => {
              setValue("latitude", pos.lat);
              setValue("longitude", pos.lng);
            }}
          />


          <p className="text-xs text-gray-500 mt-1">Click on the map to select property location</p>

          {/* IMAGE UPLOAD */}
          <input type="file" multiple accept="image/*" onChange={handleFileChange} className="border rounded-md p-2 border-l-0 border-r-0 border-t-0 border-blue-500" />

          {/* PREVIEW IMAGES */}
          <div className="grid grid-cols-3 gap-3 mt-2">
            {previewImages.map((img, i) => (
              <div key={i} className="relative">
                <img
                  src={img}
                  className="w-full h-24 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 bg-black/70 text-white px-1 rounded"
                >
                  ✕
                </button>
              </div>

            ))}

          </div>

          {/* ACTION BUTTONS */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>

            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : property ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
