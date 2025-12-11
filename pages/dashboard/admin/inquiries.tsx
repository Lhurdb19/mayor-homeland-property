"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Trash2, Check, Mail } from "lucide-react";
import axios from "axios";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import { toast, Toaster } from "sonner";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [rowHighlight, setRowHighlight] = useState<{ [key: string]: string }>({});

  // Reply modal states
  const [replyOpen, setReplyOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryType | null>(null);
  const [subject, setSubject] = useState("");
  const [replyMessage, setReplyMessage] = useState("");

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/inquiries");
      setInquiries(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch inquiries");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleMarkHandled = async (id: string) => {
    try {
      await axios.put(`/api/admin/inquiries/${id}`, { status: "handled" });
      toast.success("Inquiry marked as handled");

      // highlight row blue for 2s
      setRowHighlight((prev) => ({ ...prev, [id]: "bg-blue-100" }));
      setTimeout(() => setRowHighlight((prev) => ({ ...prev, [id]: "" })), 2000);

      fetchInquiries();
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark inquiry as handled");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`/api/admin/inquiries/${deleteId}`);
      toast.success("Inquiry deleted successfully");

      setRowHighlight((prev) => ({ ...prev, [deleteId]: "bg-yellow-100" }));
      setTimeout(() => {
        fetchInquiries();
        setDeleteId(null);
      }, 500);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete inquiry");
    }
  };

  // Open reply modal
  const openReplyModal = (inquiry: InquiryType) => {
    setSelectedInquiry(inquiry);
    setSubject("");
    setReplyMessage("");
    setReplyOpen(true);
  };

  // Send reply email
  const handleSendReply = async () => {
    if (!selectedInquiry) return;

    if (!subject || !replyMessage) {
      toast.error("Please enter subject and message");
      return;
    }

    try {
      await axios.post("/api/admin/inquiries/reply", {
        email: selectedInquiry.email,
        subject,
        message: replyMessage,
      });

      toast.success("Reply sent successfully!");
      setReplyOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to send reply");
    }
  };

  return (
    <AdminLayout>
      <Toaster position="top-right" />

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
              <TableRow
                key={inq._id}
                className={`transition-colors duration-500 ${rowHighlight[inq._id] ?? ""}`}
              >
                <TableCell>{inq.name}</TableCell>
                <TableCell>{inq.email}</TableCell>
                <TableCell>{inq.phone || "-"}</TableCell>
                <TableCell>{inq.propertyId?.title || "-"}</TableCell>
                <TableCell>{inq.message}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      inq.status === "handled"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {inq.status}
                  </span>
                </TableCell>
                <TableCell className="flex gap-2">
                  {inq.status === "pending" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleMarkHandled(inq._id)}
                    >
                      <Check size={16} />
                    </Button>
                  )}

                  <Button size="sm" variant="default" onClick={() => openReplyModal(inq)}>
                    <Mail size={16} />
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      setDeleteId(inq._id);
                      setDialogOpen(true);
                    }}
                  >
                    <Trash2 size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Are you sure you want to delete this inquiry?"
      />

      {/* Reply Modal */}
      <Dialog open={replyOpen} onOpenChange={setReplyOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Reply to Inquiry</DialogTitle>
            <p className="text-sm text-gray-500">
              Sending message to:{" "}
              <span className="font-semibold">{selectedInquiry?.email}</span>
            </p>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <Input
              placeholder="Email subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />

            <Textarea
              placeholder="Type your reply..."
              className="min-h-[140px]"
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
            />
          </div>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setReplyOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendReply}>Send Reply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
