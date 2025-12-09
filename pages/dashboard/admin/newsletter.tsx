"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminNewsletterPage() {
    const [emails, setEmails] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch("/api/newsletter/get");
                const data = await res.json();

                if (!res.ok) throw new Error(data.message);
                setEmails(data.data || []);
            } catch (err: any) {
                toast.error(err.message);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const filtered = emails.filter((e) =>
        e.email.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <AdminLayout>
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                        Newsletter Subscribers
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    {/* Search */}
                    <div className="mb-4 flex items-center gap-2">
                        <Input
                            placeholder="Search email..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="max-w-sm"
                        />
                        <Button onClick={() => setQuery("")} variant="outline">
                            Clear
                        </Button>
                    </div>

                    {/* Table */}
                    {loading ? (
                        <div className="space-y-3">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>#</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Subscribed At</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {filtered.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center text-gray-500 py-4">
                                            No subscribers found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filtered.map((item, index) => (
                                        <TableRow key={item._id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell className="font-medium">{item.email}</TableCell>
                                            <TableCell>
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>

                        </Table>
                    )}
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
