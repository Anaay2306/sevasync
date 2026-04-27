import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthShell } from "@/components/auth-shell";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SevaSync | AI Social Impact OS",
  description: "AI-powered smart resource allocation and volunteer coordination for NGOs."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <AuthShell className={inter.className}>
        {children}
      </AuthShell>
    </html>
  );
}
