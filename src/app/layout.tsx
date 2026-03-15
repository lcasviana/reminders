import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";

import { RemindersProvider } from "@/context/reminders-context";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Reminders",
  description: "Your personal reminders, tasks, and to-dos",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark font-sans ${inter.variable}`}>
      <body className={`${geistMono.variable} antialiased`}>
        <RemindersProvider>{children}</RemindersProvider>
      </body>
    </html>
  );
}
