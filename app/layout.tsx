import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/context/AuthContext";
import { NotificationProvider } from '@/components/NotificationProvider';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Up4It - Spontaneous Campus Connections",
  description: "Connect with others on campus for spontaneous activities",
  keywords: "campus, social, spontaneous, activities, UBC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // We need to make sure that the className is the same on the server and client
  // by avoiding additional classes that might be added by browser extensions
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <AuthProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
