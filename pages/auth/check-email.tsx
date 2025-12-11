import { useRouter } from "next/router";
import { Button } from "@/components/ui/button";

export default function CheckEmail() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-4 bg-white text-black/80">
      <h1 className="text-2xl font-bold">Verify Your Email</h1>
      <p>We sent a verification link to your email. Please check your inbox and click the link to activate your account.</p>
      <Button onClick={() => router.push("/auth/login")}>Go to Login</Button>
    </div>
  );
}
