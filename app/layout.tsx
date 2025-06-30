import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "../components/ui/sonner";
import Providers from "../components/Providers";

export const metadata: Metadata = {
  title: "OwnShopy - Premium E-commerce",
  description: "Your premium shopping destination",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <main className="min-h-screen">
            {children}
            <Toaster position="top-right" richColors closeButton />
          </main>
        </Providers>
      </body>
    </html>
  );
}