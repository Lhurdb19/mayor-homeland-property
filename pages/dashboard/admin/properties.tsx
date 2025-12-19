"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import AdminLayout from "@/components/admin/AdminLayout";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

import {
  Plus,
  Edit,
  Trash2,
  Eye,
  MapPin,
  BedDouble,
  Bath,
  Ruler,
} from "lucide-react";

import PropertyModalForm from "@/components/admin/PropertyModalForm";
import PropertyDetailsModal from "@/components/admin/PropertyDetailsModal";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";

interface PropertyType {
  _id: string;
  title: string;
  price: number;
  location: string;
  status: string;
  type: "sale" | "rent" | "lease" | "land";
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  images: string[];
  views: number;
  description: string; // ← missing before
}

const PROPERTY_TYPES: Array<PropertyType["type"]> = [
  "sale",
  "rent",
  "lease",
  "land",
];

export default function PropertiesPage() {
  const [activeType, setActiveType] = useState<PropertyType["type"]>("sale");
  const [properties, setProperties] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState(true);

  // modal states
  const [propertyModalOpen, setPropertyModalOpen] = useState(false);
  const [editProperty, setEditProperty] = useState<PropertyType | null>(null);
  const [viewProperty, setViewProperty] = useState<PropertyType | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 6;

  const cache = useRef<Record<string, PropertyType[]>>({});

  // fetch properties, including pending if requested
  const fetchProperties = async (typeOrStatus: string, pageNumber = 1) => {
    const key = `${typeOrStatus}-${pageNumber}`;
    setLoading(true);

    if (cache.current[key]) {
      setProperties(cache.current[key]);
      setLoading(false);
      return;
    }

    try {
      const isPendingTab = typeOrStatus === "pending";
      const params: any = { page: pageNumber, limit: perPage };
      if (!isPendingTab) params.type = typeOrStatus;
      if (isPendingTab) params.status = "pending";

      const res = await axios.get("/api/admin/properties", { params });
      setProperties(res.data.data);
      setTotalPages(Math.ceil(res.data.meta.total / res.data.meta.perPage));
      cache.current[key] = res.data.data;
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties(activeType, 1);
  }, [activeType]);

  // delete property
  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    await axios.delete(`/api/admin/properties/${deleteId}`);
    cache.current = {};
    fetchProperties(activeType, page);
    setDeleteId(null);
  };

  // approve/reject property
  const handleUpdateStatus = async (id: string, status: "available" | "rejected") => {
    try {
      await axios.put(`/api/admin/properties/${id}`, { status });
      cache.current = {};
      fetchProperties(activeType, page);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Properties</h1>
          <p className="text-sm text-muted-foreground">Manage all listed properties</p>
        </div>
        <Button
          onClick={() => {
            setEditProperty(null);
            setPropertyModalOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Property
        </Button>
      </div>

      {/* TABS */}
      <Tabs
        value={activeType}
        onValueChange={(v) => {
          setActiveType(v as PropertyType["type"]);
          setPage(1);
        }}
        className="space-y-6 text-black"
      >
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="sale" className="text-black">Sale</TabsTrigger>
          <TabsTrigger value="rent" className="text-black">Rent</TabsTrigger>
          <TabsTrigger value="lease" className="text-black">Lease</TabsTrigger>
          <TabsTrigger value="land" className="text-black">Land</TabsTrigger>
          <TabsTrigger value="pending" className="text-black">Pending</TabsTrigger>
        </TabsList>

        {PROPERTY_TYPES.concat("pending" as any).map((type) => (
          <TabsContent key={type} value={type}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading
                ? Array.from({ length: perPage }).map((_, i) => (
                    <Card key={i} className="h-[200px] animate-pulse" />
                  ))
                : properties.map((p) => (
                    <Card key={p._id} className="overflow-hidden">
                      <AspectRatio ratio={14 / 6}>
                        <img
                          src={p.images?.[0] || "/placeholder.jpg"}
                          className="object-cover w-full h-full"
                        />
                      </AspectRatio>

                      <CardHeader>
                        <CardTitle>{p.title}</CardTitle>
                        <div className="flex items-center text-sm gap-1">
                          <MapPin size={14} /> {p.location}
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-semibold">₦{p.price.toLocaleString()}</span>
                          <Badge>{p.type}</Badge>
                        </div>

                        <div className="grid grid-cols-3 text-xs">
                          <span>
                            <BedDouble size={14} /> {p.bedrooms}
                          </span>
                          <span>
                            <Bath size={14} /> {p.bathrooms}
                          </span>
                          <span>
                            <Ruler size={14} /> {p.sqft}
                          </span>
                        </div>

                        <div className="flex gap-2 pt-2">
                          {/* EDIT */}
                          {p.status !== "pending" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditProperty(p);
                                setPropertyModalOpen(true);
                              }}
                            >
                              <Edit size={14} />
                            </Button>
                          )}

                          {/* VIEW */}
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => setViewProperty(p)}
                          >
                            <Eye size={14} />
                          </Button>

                          {/* DELETE */}
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              setDeleteId(p._id);
                              setDeleteOpen(true);
                            }}
                          >
                            <Trash2 size={14} />
                          </Button>

                          {/* Approve / Reject for pending */}
                          {p.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleUpdateStatus(p._id, "available")}
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleUpdateStatus(p._id, "rejected")}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* ADD / EDIT MODAL */}
      <PropertyModalForm
        open={propertyModalOpen}
        property={editProperty}
        onClose={() => setPropertyModalOpen(false)}
        refresh={() => {
          cache.current = {};
          fetchProperties(activeType, page);
        }}
      />

      {/* VIEW MODAL */}
      {viewProperty && (
        <PropertyDetailsModal
          open
          property={viewProperty}
          onClose={() => setViewProperty(null)}
        />
      )}

      <DeleteConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </AdminLayout>
  );
}
