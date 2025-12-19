"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import TransactionModalForm from "@/components/admin/TransactionModalForm";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";

interface TransactionType {
  _id: string;
  user: { firstName: string; lastName: string; email: string };
  type: "credit" | "debit";
  amount: number;
  status: "success" | "pending" | "failed";
  description: string;
  reference: string;
  createdAt: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTransaction, setEditTransaction] = useState<TransactionType | null>(null);

  // Delete Dialog state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/transactions");
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleDelete = async () => {
    if (!selectedTransactionId) return;
    try {
      await axios.delete(`/api/admin/transactions/${selectedTransactionId}`);
      fetchTransactions();
      setDeleteOpen(false);
      setSelectedTransactionId(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <Button onClick={() => { setEditTransaction(null); setModalOpen(true); }} variant="default">
          <Plus className="mr-2" /> Add Transaction
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-5/6 mb-1" />
              <Skeleton className="h-4 w-2/3" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {transactions.map((t) => (
            <Card key={t._id} className="p-2 flex flex-col justify-between">
              <CardHeader>
                <CardTitle>{t.type.toUpperCase()}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <p>User: {t.user.firstName} {t.user.lastName}</p>
                <p>Email: {t.user.email}</p>
                <p>Amount: ₦{t.amount}</p>
                <p>Status: {t.status}</p>
                <p>Description: {t.description}</p>
                <p>Reference: {t.reference}</p>
                <p className="text-xs text-gray-400">{new Date(t.createdAt).toLocaleString()}</p>
              </CardContent>
              <div className="flex gap-2 mt-4">
                {/* <Button
                  size="sm"
                  variant="secondary"
                  className=" text-white"
                  onClick={() => { setEditTransaction(t); setModalOpen(true); }}
                >
                  <Edit size={16} />
                </Button> */}

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => { setSelectedTransactionId(t._id); setDeleteOpen(true); }}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Transaction Modal */}
      {modalOpen && (
        <TransactionModalForm
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          transaction={editTransaction}
          refresh={fetchTransactions}
        />
      )}

      {/* Delete Dialog */}
      <DeleteConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Transaction"
        />
    </AdminLayout>
  );
}
