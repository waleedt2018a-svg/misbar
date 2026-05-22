import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "مِسبار — منصة بحثية طلابية",
  description: "حيث يُصنع الباحثون"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="bg-navy text-ivory">
      <body className="misbar-root bg-navy text-ivory antialiased">{children}</body>
    </html>
  );
}
