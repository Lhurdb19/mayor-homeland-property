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

export default function PropertyModalForm({ open, onClose, property, refresh }) {
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

  const handleFileChange = (e: any) => {
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
          <Input placeholder="Title" {...register("title", { required: true })} />
          {errors.title && <p className="text-red-500 text-xs">Title is required</p>}

          <textarea {...register("description", { required: true })} className="w-full border rounded p-2" rows={3} placeholder="Description" />
          {errors.description && <p className="text-red-500 text-xs">Description is required</p>}

          <Input type="number" placeholder="Price" {...register("price", { required: true })} />

          <Input placeholder="Location" {...register("location", { required: true })} />

          {/* SELECTS */}
          <div className="grid grid-cols-2 gap-3">
            <select
              {...register("status")}
              className="border rounded p-2 w-full"
            >
              <option value="available">Available</option>
              <option value="sold">Sold</option>
              <option value="rented">Rented</option>
            </select>

            <select {...register("type")} className="border rounded p-2 w-full">
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
            />

            <Input
              type="number"
              placeholder="Bathrooms"
              {...register("bathrooms")}
            />

            <Input type="number" placeholder="Sqft" {...register("sqft")} />
          </div>

          {/* CONTACT */}
          <Input placeholder="Phone" {...register("phone")} />
          <Input type="email" placeholder="Email" {...register("email")} />

          <MapPicker
            value={
              watch("latitude") && watch("longitude")
                ? { lat: watch("latitude"), lng: watch("longitude") }
                : undefined
            }
            onChange={async (pos) => {
              setValue("latitude", pos.lat);
              setValue("longitude", pos.lng);

              // If editing an existing property, save coordinates immediately
              if (property?._id) {
                try {
                  await axios.put(`/api/admin/properties/${property._id}`, {
                    latitude: pos.lat,
                    longitude: pos.lng,
                  });
                } catch (err) {
                  console.error("Failed to update map coordinates", err);
                }
              }
            }}
          />

          <p className="text-xs text-gray-500 mt-1">Click on the map to select property location</p>

          {/* IMAGE UPLOAD */}
          <input type="file" multiple accept="image/*" onChange={handleFileChange} />

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
