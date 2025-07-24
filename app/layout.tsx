import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "../components/ui/sonner";
import Providers from "../components/Providers"; // <-- Import your new Providers component
import Chatbot from "../components/Chatbot";

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || "OwnShopy",
  description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || "Premium E-commerce Platform",
};
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-gray-900">
      <body className={inter.className}>
        <Providers>
          <main className="bg-gray-900">
            {children}
            <Toaster 
              position="top-right" 
              richColors 
              closeButton 
              toastOptions={{
                style: {
                  fontSize: '14px',
                },
                className: 'toast-custom',
              }}
              style={{
                '--mobile-offset-top': '80px', // Account for navbar (64px) + padding
                '--mobile-offset-right': '16px',
                '--mobile-offset-left': '16px',
                '--width': '356px', // Desktop width
              } as React.CSSProperties}
              // Mobile-specific positioning
              offset={24} // Desktop offset
              mobileOffset={{ 
                top: 80,    // Respect navbar height (64px) + spacing
                right: 16,  // Small right margin
                left: 16,   // Small left margin
                bottom: 16  // Bottom spacing
              }}
            />
            <Chatbot />
          </main>
        </Providers>
      </body>
    </html>
  );
}