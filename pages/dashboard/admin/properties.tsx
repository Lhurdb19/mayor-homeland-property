"use client";

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import PropertyModalForm from "@/components/admin/PropertyModalForm";
import PropertyDetailsModal from "@/components/admin/PropertyDetailsModal";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";

interface PropertyType {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  status: string;
  type: "sale" | "rent" | "lease" | "land";
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  phone: string;
  email: string;
  images: string[];
  views: number;
}

interface PropertiesResponse {
  data: PropertyType[];
  meta: { total: number; page: number; perPage: number };
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editProperty, setEditProperty] = useState<PropertyType | null>(null);
  const [viewProperty, setViewProperty] = useState<PropertyType | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Cache properties to avoid re-fetching same page
  const cache = useRef<{ [key: number]: PropertyType[] }>({});

  const perPage = 6;

  const fetchProperties = async (pageNumber = 1) => {
    setLoading(true);

    // If cached, use it
    if (cache.current[pageNumber]) {
      setProperties(cache.current[pageNumber]);
      setPage(pageNumber);
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get<PropertiesResponse>("/api/admin/properties", {
        params: { page: pageNumber, limit: perPage },
      });
      const data = res.data.data;
      const meta = res.data.meta;

      setProperties(data);
      setPage(meta.page);
      setTotalPages(Math.ceil(meta.total / meta.perPage));

      // Cache this page
      cache.current[pageNumber] = data;
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProperties(1);
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    await axios.delete(`/api/admin/properties/${deleteId}`);
    // Clear cache and refetch current page
    cache.current = {};
    fetchProperties(page);
    setDeleteId(null);
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Properties</h1>
        <Button
          onClick={() => { setEditProperty(null); setModalOpen(true); }}
          variant="default"
        >
          <Plus className="mr-2" /> Add Property
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: perPage }).map((_, i) => (
              <Card key={i} className="p-4 animate-pulse h-72"></Card>
            ))
          : properties.map((p) => (
              <Card key={p._id} className="p-4 flex flex-col justify-between hover:shadow-lg transition">
                <CardHeader>
                  <CardTitle>{p.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Location: {p.location}</p>
                  <p>Price: ₦{p.price.toLocaleString()}</p>
                  <p>Status: {p.status}</p>
                  <p>Type: {p.type}</p>
                  <div className="flex gap-1 mt-2 overflow-x-auto">
                    {p.images.map((img, i) => (
                      <img key={i} src={img} className="h-16 w-24 object-cover rounded" />
                    ))}
                  </div>
                </CardContent>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" className="bg-black border text-white"
                    onClick={() => { setEditProperty(p); setModalOpen(true); }}>
                    <Edit size={16} className="text-black"/>
                  </Button>
                  <Button size="sm" variant="outline" className="bg-green-600 border text-white"
                    onClick={() => { setViewProperty(p); setDetailsOpen(true); }}>
                    <Eye size={16} className="text-green-600" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => { setDeleteId(p._id); setDeleteOpen(true); }}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </Card>
            ))
        }
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-6">
          <Button
            onClick={() => fetchProperties(page - 1)}
            disabled={page <= 1}
            variant="outline"
            className="text-white"
          >
            <ChevronLeft /> Prev
          </Button>
          <span className="flex items-center ">Page {page} of {totalPages}</span>
          <Button
            onClick={() => fetchProperties(page + 1)}
            disabled={page >= totalPages}
            variant="outline"
            className="text-white"
          >
            Next <ChevronRight />
          </Button>
        </div>
      )}

      {modalOpen && (
        <PropertyModalForm
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          property={editProperty}
          refresh={() => { cache.current = {}; fetchProperties(page); }}
        />
      )}

      {detailsOpen && viewProperty && (
        <PropertyDetailsModal
          open={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          property={viewProperty || undefined}
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
