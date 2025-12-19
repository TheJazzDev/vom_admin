import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/Providers/Providers";

export const metadata: Metadata = {
  title: "VOM - Admin",
  description: "Valley of Mercy Admin Panel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
