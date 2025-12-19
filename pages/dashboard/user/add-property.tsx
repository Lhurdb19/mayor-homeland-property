"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import Link from "next/link";
import { toast } from "sonner";

import UserProfileLayout from "@/components/user/UserProfileLayout";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Wallet, ArrowUpRight, Home, Bell } from "lucide-react";

export default function AddPropertyPage() {
  const { data: session } = useSession();
  const user = session?.user;

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

  // User properties
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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

      const base64Images: string[] = await Promise.all(
        images.map(
          (file) =>
            new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = (err) => reject(err);
            })
        )
      );

      await axios.post("/api/properties/user", {
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
      fetchUserProperties();
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
    <Card className="mb-6 border-none overflow-hidden">
  <CardContent className="p-0">
    <div className="bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-5 md:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-md">
      
      {/* LEFT: Back button + Title */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
       

        <div className="flex flex-col">
          <h2 className="text-lg md:text-2xl font-semibold leading-tight">
            Add New Property
          </h2>
          <p className="text-sm text-blue-100">
            Fill in the details below to post your property and reach potential buyers or tenants.
          </p>
        </div>
      </div>

      {/* RIGHT: Optional Icon */}
      <div className="hidden md:flex items-center justify-center">
        <Link href="/">
        <Home className="h-10 w-10 text-white opacity-70" />
          </Link>
      </div>

    </div>
  </CardContent>
</Card>


      {/* ADD PROPERTY FORM */}
      <Card className="max-w-3xl mx-auto mb-8 p-6 bg-white rounded-xl shadow-lg">
        <CardHeader>
          <CardTitle>Add New Property</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input name="title" value={form.title} onChange={handleChange} required 
              className="rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0"
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea name="description" value={form.description} onChange={handleChange} rows={4} 
              className="rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Price (₦)</Label>
                <Input type="number" name="price" value={form.price} onChange={handleChange} required 
                className="rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0"
                />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input name="location" value={form.location} onChange={handleChange} required 
                className="rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={form.type}
                  onValueChange={(value) => setForm({ ...form, type: value })}
                >
                  <SelectTrigger className="rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0 w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-black/70 w-full">
                    <SelectItem value="sale" className="hover:bg-blue-300">Sale</SelectItem>
                    <SelectItem value="rent">Rent</SelectItem>
                    <SelectItem value="lease">Lease</SelectItem>
                    <SelectItem value="land">Land</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Bedrooms</Label>
                <Input type="number" name="bedrooms" value={form.bedrooms} onChange={handleChange} 
                className="rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0"
                />
              </div>

              <div className="space-y-2">
                <Label>Bathrooms</Label>
                <Input type="number" name="bathrooms" value={form.bathrooms} onChange={handleChange} 
                className="rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Square Footage</Label>
              <Input type="number" name="sqft" value={form.sqft} onChange={handleChange} 
              className="rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input name="phone" value={form.phone} onChange={handleChange} 
                className="rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0"
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" name="email" value={form.email} onChange={handleChange} 
                className="rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Property Images</Label>
              <Input type="file" multiple accept="image/*" onChange={handleImageChange} required 
              className="rounded border border-gray-200 outline-none p-2 focus:outline-none focus:ring-0"
              />
            </div>

            <Button type="submit" disabled={uploading} className="w-full">
              {uploading ? "Uploading..." : "Add Property"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* USER PROPERTIES */}
      <Card className="max-w-6xl mx-auto mb-6 p-6 bg-white rounded-xl shadow-lg">
        <CardHeader>
          <CardTitle>Your Posted Properties</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loadingProperties
            ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-40 w-full" />)
            : userProperties.length === 0
            ? <p>You haven't posted any properties yet.</p>
            : userProperties.map((property: any) => (
                <Card key={property._id} className="overflow-hidden rounded-xl shadow-md">
                  <div className="h-40 w-full overflow-hidden">
                    <img src={property.images[0] || "/placeholder.jpg"} className="h-full w-full object-cover" />
                  </div>
                  <CardContent className="p-2">
                    <h3 className="font-semibold text-sm">{property.title}</h3>
                    <p className="text-blue-600 text-xs font-bold">₦{property.price.toLocaleString()}</p>
                    <p className="text-gray-500 text-[11px]">{property.location}</p>
                    <div className="flex gap-2 mt-2 justify-between">
                      <Button variant="secondary" size="sm" onClick={() => handleEdit(property)}>Edit</Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setPropertyToDelete(property._id);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
        </CardContent>
      </Card>

      {/* DELETE CONFIRM */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
      />
    </UserProfileLayout>
  );
}
