"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "sonner";
import UserProfileLayout from "@/components/user/UserProfileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";

export default function AddPropertyPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    type: "",
    bedrooms: "",
    bathrooms: "",
    sqft: "",
    phone: "",
    email: "",
  });

  const [images, setImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

   // User properties state
  const [userProperties, setUserProperties] = useState<any[]>([]);
  const [loadingProperties, setLoadingProperties] = useState(true);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);


  const fetchUserProperties = async () => {
    setLoadingProperties(true);
    try {
      const res = await axios.get("/api/properties/user");
      setUserProperties(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch your properties");
    } finally {
      setLoadingProperties(false);
    }
  };

  useEffect(() => {
    fetchUserProperties();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title || !form.price || !form.location || !form.type || images.length === 0) {
      toast.error("Title, price, location, type, and at least one image are required!");
      return;
    }

    try {
      setUploading(true);

      // Convert images to base64
      const base64Images: string[] = await Promise.all(
        images.map(file => new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = error => reject(error);
        }))
      );

      // Submit property to user API
      const res = await axios.post("/api/properties/user", {
        ...form,
        price: Number(form.price),
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        sqft: Number(form.sqft),
        images: base64Images,
      });

      toast.success("Property added successfully!");
       setForm({
        title: "",
        description: "",
        price: "",
        location: "",
        type: "",
        bedrooms: "",
        bathrooms: "",
        sqft: "",
        phone: "",
        email: "",
      });
      setImages([]);
      fetchUserProperties(); // Refresh list
    } catch (err) {
      console.error(err);
      toast.error("Failed to add property");
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (property: any) => {
    setForm({
      title: property.title,
      description: property.description,
      price: property.price,
      location: property.location,
      type: property.type,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      sqft: property.sqft,
      phone: property.phone,
      email: property.email,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async () => {
    if (!propertyToDelete) return;
    try {
      await axios.delete(`/api/properties/user/${propertyToDelete}`);
      toast.success("Property deleted successfully!");
      setDeleteDialogOpen(false);
      setPropertyToDelete(null);
      fetchUserProperties();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete property");
    }
  };


  return (
    <UserProfileLayout>
      <div className="max-w-3xl dark:bg-black dark:shadow-[#2e2e2e] mx-auto p-6 bg-white text-black/80 dark:text-white rounded-xl shadow-lg">
        <h1 className="text-sm md:text-lg font-bold mb-6">Add New Property</h1>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-2">
            <label className="block font-medium text-sm">Title</label>
            <input type="text" name="title" value={form.title} onChange={handleChange} className="w-full border rounded-md p-2 border-l-0 border-r-0 border-t-0 border-blue-500" required />
          </div>

          <div className="space-y-2">
            <label className="block font-medium text-sm">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded-md p-2 border-l-0 border-r-0 border-t-0 border-blue-500" rows={4} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block font-medium text-sm">Price (₦)</label>
              <input type="number" name="price" value={form.price} onChange={handleChange} className="w-full border rounded-md p-2 border-l-0 border-r-0 border-t-0 border-blue-500" required />
            </div>

            <div className="space-y-2">
              <label className="block font-medium text-sm">Location</label>
              <input type="text" name="location" value={form.location} onChange={handleChange} className="w-full border rounded-md p-2 border-l-0 border-r-0 border-t-0 border-blue-500" required />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block font-medium text-sm">Type</label>
              <select name="type" value={form.type} onChange={handleChange} className="w-full border rounded-md p-2 border-l-0 border-r-0 border-t-0 border-blue-500" required>
                <option value="">Select type</option>
                <option value="sale">Sale</option>
                <option value="rent">Rent</option>
                <option value="lease">Lease</option>
                <option value="land">Land</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block font-medium text-sm">Bedrooms</label>
              <input type="number" name="bedrooms" value={form.bedrooms} onChange={handleChange} className="w-full border rounded-md p-2 border-l-0 border-r-0 border-t-0 border-blue-500" />
            </div>

            <div className="space-y-2">
              <label className="block font-medium text-sm">Bathrooms</label>
              <input type="number" name="bathrooms" value={form.bathrooms} onChange={handleChange} className="w-full border rounded-md p-2 border-l-0 border-r-0 border-t-0 border-blue-500" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block font-medium text-sm">Square Footage</label>
            <input type="number" name="sqft" value={form.sqft} onChange={handleChange} className="w-full border rounded-md p-2 border-l-0 border-r-0 border-t-0 border-blue-500" />
          </div>

          <div className="space-y-2">
            <label className="block font-medium text-sm">Phone</label>
            <input type="text" name="phone" value={form.phone} onChange={handleChange} className="w-full border rounded-md p-2 border-l-0 border-r-0 border-t-0 border-blue-500" />
          </div>

          <div className="space-y-2">
            <label className="block font-medium text-sm">Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full border rounded-md p-2 border-l-0 border-r-0 border-t-0 border-blue-500" />
          </div>

          <div className="space-y-2">
            <label className="block font-medium text-sm">Property Images</label>
            <input type="file" multiple accept="image/*" onChange={handleImageChange} className="w-full border rounded-md p-2 border-l-0 border-r-0 border-t-0 border-blue-500" required />
          </div>

          <button type="submit" disabled={uploading} className="bg-blue-600 text-white px-4 py-1 text-sm rounded-md hover:bg-blue-700 transition">
            {uploading ? "Uploading..." : "Add Property"}
          </button>
        </form>
      </div>
       
       <div className="max-w-3xl mx-auto mt-8 text-black/80 dark:text-white">
        <h2 className="text-sm md:text-lg font-bold">Your Posted Properties</h2>

        {loadingProperties ? (
          <p>Loading your properties...</p>
        ) : userProperties.length === 0 ? (
          <p>You haven't posted any properties yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {userProperties.map((property: any) => (
              <Card key={property._id} className="overflow-hidden rounded-xl shadow-md relative p-2 gap-1">
                <div className="h-30 w-full overflow-hidden">
                  <img
                    src={property.images[0] || "/placeholder.jpg"}
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardContent className="p-0">
                  <h3 className="font-semibold text-sm">{property.title}</h3>
                  <p className="text-blue-600 text-xs font-bold">₦{property.price.toLocaleString()}</p>
                  <p className="text-gray-500 text-[11px]">{property.location}</p>
                  <div className="flex gap-2 mt-2 justify-between">
                    <Button
                      variant="secondary"
                      onClick={() => handleEdit(property)}
                      className="text-xs"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setPropertyToDelete(property._id);
                        setDeleteDialogOpen(true);
                      }}
                      className="text-[10px]"
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

        {/* Delete Confirmation Overlay */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
      />

    </UserProfileLayout>
  );
}
