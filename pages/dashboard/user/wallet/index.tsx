"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpRight, CreditCard, Plus, ArrowDown, Repeat, MoreHorizontal } from "lucide-react";
import UserProfileLayout from "@/components/user/UserProfileLayout";
import { toast } from "sonner";
import { useUser } from "@/hooks/useUser";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Eye, Share2, X } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";


interface Transaction {
    id: string;
    type: "credit" | "debit";
    amount: number;
    status: "success" | "pending" | "failed";
    description: string;
    reference: string;
    date: string | null;
}


/* ------------------ RELATIVE TIME HELPER ------------------ */
const getDayLabel = (dateString: string | null) => {
    if (!dateString) return "Older";

    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";

    return date.toLocaleDateString("en-NG", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

/* ------------------ RELATIVE TIME ------------------ */
const timeAgo = (dateString: string | null) => {
    if (!dateString) return "—";

    const diff = Date.now() - new Date(dateString).getTime();
    const seconds = Math.floor(diff / 1000);

    if (seconds < 60) return "Just now";

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hr ago`;

    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
};

/* ------------------ LOCALE-AWARE TIME ------------------ */
const formatSmartTime = (dateString: string | null) => {
  if (!dateString) return "—";

  const date = new Date(dateString);
  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const time = date.toLocaleTimeString("en-NG", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (isToday) return `Today at ${time}`;
  if (isYesterday) return `Yesterday at ${time}`;

  return date.toLocaleDateString("en-NG", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};



export default function WalletPage() {
    const { user, refetch } = useUser();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [flutterLoaded, setFlutterLoaded] = useState(false);
    const [topupAmount, setTopupAmount] = useState<number>(1000);

    const [balance, setBalance] = useState<number>(0);
    const [income, setIncome] = useState<number>(0);
    const [expense, setExpense] = useState<number>(0);

    const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);


    const loadWallet = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const walletRes = await axios.get("/api/wallet", {
                params: { userId: user._id },
            });

            const txRes = await axios.get("/api/wallet/transaction", {
                params: { userId: user._id },
            });

            setBalance(walletRes.data.balance);
            setIncome(walletRes.data.income);
            setExpense(walletRes.data.expense);
            setTransactions(txRes.data);
        } catch {
            toast.error("Failed to load wallet");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.flutterwave.com/v3.js";
        script.onload = () => setFlutterLoaded(true);
        document.body.appendChild(script);

        loadWallet();
    }, [user]);

    const handleFlutterwave = () => {
        if (!flutterLoaded) return toast.error("Flutterwave is loading...");
        if (!topupAmount || topupAmount <= 0)
            return toast.error("Enter a valid amount");
        if (!user) return toast.error("User not loaded");

        // @ts-ignore
        window.FlutterwaveCheckout({
            public_key: process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY,
            tx_ref: `wallet-${Date.now()}`,
            amount: topupAmount,
            currency: "NGN",
            customer: {
                email: user.email,
                phone_number: user.phone,
                name: `${user.firstName} ${user.lastName}`,
            },
            callback: async (response: any) => {
                try {
                    await axios.post("/api/flutterwave/verify", {
                        transaction_id: response.transaction_id,
                        userId: user._id,
                        amount: topupAmount,
                    });
                    toast.success("Wallet topped up successfully!");
                    await loadWallet();
                    refetch();
                } catch {
                    toast.error("Payment verification failed.");
                }
            },
        });
    };

    useEffect(() => {
        if (!user) return;

        const interval = setInterval(() => {
            loadWallet();
        }, 60000); // 🔁 every 1 minute

        return () => clearInterval(interval);
    }, [user]);

    const groupedTransactions = transactions.reduce((acc: any, tx) => {
        const label = getDayLabel(tx.date);
        acc[label] = acc[label] || [];
        acc[label].push(tx);
        return acc;
    }, {});



    const getTransactionType = (type: "credit" | "debit") =>
        type === "credit" ? "Deposit" : "Withdrawal";


    return (
        <UserProfileLayout>
            <div className="min-h-screen py-16 md:p-4 space-y-6 bg-gray-50">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row items-center justify-between bg-linear-to-r from-blue-500 to-indigo-600 p-4 md:p-6 rounded-lg shadow-md text-white gap-4">
                    <div>
                        <h1 className="text-xl md:text-3xl font-bold">My Wallet</h1>
                        <p className="text-xs md:text-base">Manage your funds and transactions</p>
                    </div>

                    {/* Desktop: Amount input + buttons */}
                    <div className="hidden md:flex items-center gap-2">
                        <Input
                            type="number"
                            placeholder="Amount"
                            value={topupAmount}
                            onChange={(e) => setTopupAmount(Number(e.target.value))}
                            className="w-28"
                        />
                        <Button className="flex gap-2 text-xs md:text-sm" onClick={handleFlutterwave}>
                            <Plus className="w-4 h-4" /> Add Funds
                        </Button>
                        <Button variant="outline" className="flex items-center gap-2 hover:text-blue-500">
                            <ArrowDown className="w-4 h-4" /> Withdraw
                        </Button>
                    </div>

                    {/* Mobile Dropdown */}
                    <div className="md:hidden">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="flex items-center gap-2">
                                    <MoreHorizontal className="w-4 h-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <div className="p-2">
                                    <Input
                                        type="number"
                                        placeholder="Amount"
                                        value={topupAmount}
                                        onChange={(e) => setTopupAmount(Number(e.target.value))}
                                    />
                                </div>
                                <DropdownMenuItem className="flex items-center gap-2" onClick={handleFlutterwave}>
                                    <Plus className="w-4 h-4 text-blue-600" /> Add Funds
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center gap-2">
                                    <ArrowDown className="w-4 h-4 text-blue-600" /> Withdraw
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center gap-2">
                                    <Repeat className="w-4 h-4 text-blue-600" /> Transfer
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* BALANCE CARDS */}
                <Card className="bg-white shadow-md rounded-xl">
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                        <Card className="p-4">
                            <p className="text-gray-500 text-sm flex items-center gap-1">
                                <CreditCard className="w-4 h-4" /> Current Balance
                            </p>
                            {loading ? <Skeleton className="h-8 w-32 mt-1" /> :
                                <p className="text-lg md:text-xl font-bold"> ₦{(balance ?? 0).toLocaleString()}</p>
                            }
                        </Card>
                        <Card className="p-4">
                            <p className="text-gray-500 text-sm flex items-center gap-1">
                                <ArrowUpRight className="w-4 h-4" /> Total Income
                            </p>
                            {loading ? <Skeleton className="h-8 w-32 mt-1" /> :
                                <p className="text-lg md:text-xl font-bold"> ₦{(income ?? 0).toLocaleString()}</p>
                            }
                        </Card>
                        <Card className="p-4">
                            <p className="text-gray-500 text-sm flex items-center gap-1">
                                <ArrowDown className="w-4 h-4" /> Total Expense
                            </p>
                            {loading ? <Skeleton className="h-8 w-32 mt-1" /> :
                                <p className="text-lg md:text-xl font-bold"> ₦{(expense ?? 0).toLocaleString()}</p>
                            }
                        </Card>
                    </CardContent>
                </Card>

                {/* TRANSACTIONS TABS */}
                <Tabs defaultValue="transactions" className="space-y-4">
                    <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full border-b bg-white text-black/80 shadow">
                        <TabsTrigger className="flex items-center gap-1" value="transactions">
                            <ArrowUpRight className="w-5 h-5" />
                            <span className="hidden md:inline">Transactions</span>
                        </TabsTrigger>
                        <TabsTrigger className="flex items-center gap-1" value="settings">
                            <CreditCard className="w-5 h-5" />
                            <span className="hidden md:inline">Settings</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="transactions">
                        <Card className="bg-white shadow-md rounded-xl">
                            <CardHeader>
                                <CardTitle>Transaction History</CardTitle>
                            </CardHeader>

                            <CardContent className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="hover:bg-black/10">
                                            <TableHead>Type</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead className="text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody>
                                        {loading ? (
                                            <TableRow>
                                                <TableCell colSpan={5}>
                                                    <Skeleton className="h-10 w-full" />
                                                </TableCell>
                                            </TableRow>
                                        ) : Object.keys(groupedTransactions).length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center text-gray-500">
                                                    No transactions yet.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            Object.entries(groupedTransactions).map(([label, txs]: any) => (
                                                <>
                                                    {/* GROUP HEADER */}
                                                    <TableRow key={label}>
                                                        <TableCell
                                                            colSpan={5}
                                                            className="bg-gray-100 font-semibold text-gray-700"
                                                        >
                                                            {label}
                                                        </TableCell>
                                                    </TableRow>

                                                    {/* TRANSACTIONS */}
                                                    {txs.map((tx: Transaction) => (
                                                        <TableRow key={tx.id} className="hover:bg-black/10">
                                                            <TableCell>
                                                                <Badge
                                                                    className={
                                                                        tx.type === "credit"
                                                                            ? "bg-green-100 text-green-700"
                                                                            : "bg-red-100 text-red-700"
                                                                    }
                                                                >
                                                                    {getTransactionType(tx.type)}
                                                                </Badge>
                                                            </TableCell>

                                                            <TableCell className="text-gray-500">
                                                                {tx.date ? (
                                                                    <span
                                                                        title={new Date(tx.date).toLocaleString("en-NG")}
                                                                        className="cursor-help"
                                                                    >
                                                                        {formatSmartTime(tx.date)}
                                                                    </span>
                                                                ) : (
                                                                    "—"
                                                                )}
                                                            </TableCell>

                                                            <TableCell>{tx.description}</TableCell>

                                                            <TableCell
                                                                className={`font-semibold ${tx.type === "credit"
                                                                    ? "text-green-600"
                                                                    : "text-red-600"
                                                                    }`}
                                                            >
                                                                {tx.type === "credit" ? "+" : "-"}₦
                                                                {tx.amount.toLocaleString()}
                                                            </TableCell>

                                                            <TableCell className="text-right">
                                                                <Button
                                                                    size="icon"
                                                                    variant="ghost"
                                                                    onClick={() => setSelectedTx(tx)}
                                                                >
                                                                    <Eye className="w-4 h-4" />
                                                                </Button>

                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </>
                                            ))
                                        )}
                                    </TableBody>

                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>



                    <TabsContent value="settings">
                        <p className="text-gray-700">Wallet settings and preferences will go here.</p>
                    </TabsContent>
                </Tabs>
            </div>

            <Dialog open={!!selectedTx} onOpenChange={() => setSelectedTx(null)}>
                <DialogContent className="max-w-md  bg-white text-black/70">
                    {selectedTx && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="flex items-center justify-between">
                                    <span>
                                        {selectedTx.type === "credit" ? "Deposit" : "Withdrawal"}
                                    </span>
                                </DialogTitle>
                            </DialogHeader>

                            <Card className="border-none shadow-none">
                                <CardContent className="space-y-4 p-0">
                                    {/* DATE */}
                                    <p className="text-sm text-gray-500">
                                        {selectedTx.date
                                            ? new Date(selectedTx.date).toLocaleString("en-NG")
                                            : "—"}
                                    </p>

                                    {/* AMOUNT */}
                                    <p
                                        className={`text-2xl font-bold ${selectedTx.type === "credit"
                                                ? "text-green-600"
                                                : "text-red-600"
                                            }`}
                                    >
                                        {selectedTx.type === "credit" ? "+" : "-"}₦
                                        {selectedTx.amount.toLocaleString()}
                                    </p>

                                    {/* DETAILS */}
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Description</span>
                                            <span className="font-medium text-right">
                                                {selectedTx.description}
                                            </span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Transaction ID</span>
                                            <span className="font-mono text-xs break-all">
                                                {selectedTx.id}
                                            </span>
                                        </div>

                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Reference</span>
                                            <span className="font-mono text-xs break-all">
                                                {selectedTx.reference}
                                            </span>
                                        </div>
                                    </div>

                                    {/* SHARE BUTTON */}
                                    <Button
                                        variant="outline"
                                        className="w-full flex gap-2 shadow hover:text-black/80"
                                        onClick={() => {
                                            navigator.share?.({
                                                title: "Transaction Details",
                                                text: `Transaction ${selectedTx.id}`,
                                            }) || toast.success("Share not supported");
                                        }}
                                    >
                                        <Share2 className="w-4 h-4" />
                                        Share Transaction
                                    </Button>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </DialogContent>
            </Dialog>

        </UserProfileLayout>
    );
}
