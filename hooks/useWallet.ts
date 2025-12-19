// hooks/useWallet.ts
"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface WalletData {
    balance: number | null;
    loading: boolean;
    refetchWallet: () => Promise<void>;
}

export function useWallet(userId?: string): WalletData {
    const [balance, setBalance] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchWallet = async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const res = await axios.get("/api/wallet", { params: { userId } });
            setBalance(res.data.balance ?? 0);
        } catch (err) {
            console.error(err);
            setBalance(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) fetchWallet();
    }, [userId]);

    return { balance, loading, refetchWallet: fetchWallet };
}
