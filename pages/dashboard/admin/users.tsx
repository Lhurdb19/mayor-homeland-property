"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Plus } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import UserModalForm from "@/components/user/UserModal";

interface UserType {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  isVerified: boolean;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editUser, setEditUser] = useState<UserType | null>(null);

  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await axios.get("/api/admin/users");
    setUsers(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);


  const openDelete = (id: string) => {
    setDeleteId(id);
    setDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`/api/admin/users/${deleteId}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
        <Button
          onClick={() => { setEditUser(null); setModalOpen(true); }}
        >
          <Plus className="mr-2" /> Add User
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
          {users.map((user) => (
            <Card key={user._id} className="p-4 flex flex-col justify-between">
              <div>
                <CardHeader>
                  <CardTitle>{user.firstName} {user.lastName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">Email: {user.email}</p>
                  <p className="text-sm text-gray-600">Phone: {user.phone}</p>
                  <p className="text-sm text-gray-600">Address: {user.address}</p>
                  <p className="text-sm font-medium">Role: {user.role}</p>
                  <p className="text-sm">
                    Status:{" "}
                    <span className={user.isVerified ? "text-green-600" : "text-red-600"}>
                      {user.isVerified ? "Verified" : "Not Verified"}
                    </span>
                  </p>

                </CardContent>
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-blue-600 text-white"
                  onClick={() => {
                    setEditUser(user);
                    setModalOpen(true);
                  }}
                >
                  <Edit size={16} />
                </Button>

                <Button size="sm" variant="destructive" onClick={() => openDelete(user._id)}>
                  <Trash2 size={16} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <UserModalForm
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        user={editUser}
        refresh={fetchUsers}
      />

      <DeleteConfirmDialog
        open={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Are you sure you want to delete this user?"
      />

    </AdminLayout>
  );
}
