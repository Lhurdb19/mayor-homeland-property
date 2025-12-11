import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { toast } from "sonner";
import axios from "axios";

export default function VerifyEmail() {
  const router = useRouter();
  const { token } = router.query;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const verify = async () => {
      try {
        await axios.get(`/api/auth/verify-email?token=${token}`);
        toast.success("Email verified successfully! Please login.");
        router.replace("/auth/login");
      } catch (err: any) {
        toast.error(err?.response?.data || "Verification failed or expired.");
        setLoading(false);
      }
    };

    verify();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-white text-black/80">
      <h1 className="text-xl font-bold">{loading ? "Verifying your email..." : "Verification failed."}</h1>
    </div>
  );
}
