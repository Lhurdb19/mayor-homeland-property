import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Navbar from "@/components/navbar";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "@/components/theme-provider";


export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const pathname = usePathname();
  const hideLayout = pathname?.startsWith("/dashboard");

  return (
    <SessionProvider session={session}>
      <ThemeProvider>
        {!hideLayout && <Navbar />}
        <Component {...pageProps} />
        <Toaster position="top-right" />
        {!hideLayout && <Footer />}
      </ThemeProvider>
    </SessionProvider>
  );
}
