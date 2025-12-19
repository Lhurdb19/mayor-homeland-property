"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Trash2, Check, Mail } from "lucide-react";
import axios from "axios";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import { toast, Toaster } from "sonner";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

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

  const openReplyModal = (inquiry: InquiryType) => {
    setSelectedInquiry(inquiry);
    setSubject("");
    setReplyMessage("");
    setReplyOpen(true);
  };

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

  // Helper to truncate text
  const truncateText = (text: string, length = 12) => {
    if (!text) return "-";
    return text.length > length ? `...${text.slice(length)}` : text;
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
        <div className="overflow-x-auto w-full">
          <Table className="min-w-[800px] table-auto">
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
                  <TableCell className="break-words max-w-[150px]">{inq.name}</TableCell>
                  <TableCell className="break-words max-w-[200px]">{inq.email}</TableCell>
                  <TableCell className="break-words max-w-[120px]">{inq.phone || "-"}</TableCell>
                  <TableCell className="break-words max-w-[150px] truncate">
                    {truncateText(inq.propertyId?.title, 12)}
                  </TableCell>
                  <TableCell className="break-words max-w-[250px] truncate">
                    {truncateText(inq.message, 15)}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${inq.status === "handled"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                        }`}
                    >
                      {inq.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="outline">
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {inq.status === "pending" && (
                          <DropdownMenuItem onClick={() => handleMarkHandled(inq._id)}>
                            <Check size={16} className="mr-2" /> Mark Handled
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => openReplyModal(inq)}>
                          <Mail size={16} className="mr-2" /> Reply
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setDeleteId(inq._id);
                            setDialogOpen(true);
                          }}
                        >
                          <Trash2 size={16} className="mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

          </Table>
        </div>
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
        <DialogContent className="max-w-lg w-full">
          <DialogHeader>
            <DialogTitle className="text-black">Reply to Inquiry</DialogTitle>
            <p className="text-sm text-gray-500">
              Sending message to:{" "}
              <span className="font-semibold">{selectedInquiry?.email}</span>
            </p>
            <p className="text-sm text-gray-700 mt-1">
              <span className="font-semibold">Name:</span> {selectedInquiry?.name}
            </p>
            <p className="text-sm text-gray-700 mt-1">
              <span className="font-semibold">Property:</span> {selectedInquiry?.propertyId.title}
            </p>
            <p className="text-sm text-gray-700 mt-1">
              <span className="font-semibold">Message:</span> {selectedInquiry?.message}
            </p>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <Input
              placeholder="Email subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <Textarea
              placeholder="Type your reply..."
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              className="w-full min-h-[140px] p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <DialogFooter className="mt-4 flex justify-end gap-2">
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
