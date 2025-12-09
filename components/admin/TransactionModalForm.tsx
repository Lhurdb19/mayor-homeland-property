"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";

interface TransactionModalFormProps {
  open: boolean;
  onClose: () => void;
  transaction: any;
  refresh: () => void;
}

export default function TransactionModalForm({ open, onClose, transaction, refresh }: TransactionModalFormProps) {
  const [form, setForm] = useState({
    propertyId: "",
    userId: "",
    amount: "",
    status: "pending",
    method: "card",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (transaction) {
      setForm({
        propertyId: transaction.propertyId._id,
        userId: transaction.userId._id,
        amount: transaction.amount,
        status: transaction.status,
        method: transaction.method,
      });
    } else {
      setForm({ propertyId: "", userId: "", amount: "", status: "pending", method: "card" });
    }
  }, [transaction]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (transaction) {
        await axios.put(`/api/admin/transactions/${transaction._id}`, form);
      } else {
        await axios.post("/api/admin/transactions", form);
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
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{transaction ? "Edit Transaction" : "Add Transaction"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input placeholder="Property ID" name="propertyId" value={form.propertyId} onChange={handleChange} />
          <Input placeholder="User ID" name="userId" value={form.userId} onChange={handleChange} />
          <Input placeholder="Amount" name="amount" type="number" value={form.amount} onChange={handleChange} />
          <select name="status" value={form.status} onChange={handleChange} className="w-full border rounded-md p-2">
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="refunded">Refunded</option>
          </select>
          <select name="method" value={form.method} onChange={handleChange} className="w-full border rounded-md p-2">
            <option value="card">Card</option>
            <option value="bank">Bank</option>
            <option value="wallet">Wallet</option>
          </select>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={loading}>{loading ? "Saving..." : "Save"}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
