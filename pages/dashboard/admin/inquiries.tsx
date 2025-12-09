"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Trash2, Check } from "lucide-react";
import axios from "axios";

interface InquiryType {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: "pending" | "handled";
  propertyId?: any;
  createdAt: string;
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<InquiryType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/inquiries");
      setInquiries(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleMarkHandled = async (id: string) => {
    try {
      await axios.put(`/api/admin/inquiries/${id}`, { status: "handled" });
      fetchInquiries();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;
    try {
      await axios.delete(`/api/admin/inquiries/${id}`);
      fetchInquiries();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Inquiries / Leads</h1>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-md" />
          ))}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inquiries.map((inq) => (
              <TableRow key={inq._id}>
                <TableCell>{inq.name}</TableCell>
                <TableCell>{inq.email}</TableCell>
                <TableCell>{inq.phone || "-"}</TableCell>
                <TableCell>{inq.propertyId?.title || "-"}</TableCell>
                <TableCell>{inq.message}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-sm ${inq.status === "handled" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                    {inq.status}
                  </span>
                </TableCell>
                <TableCell className="flex gap-2">
                  {inq.status === "pending" && (
                    <Button size="sm" variant="outline" onClick={() => handleMarkHandled(inq._id)}>
                      <Check size={16} />
                    </Button>
                  )}
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(inq._id)}>
                    <Trash2 size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </AdminLayout>
  );
}
