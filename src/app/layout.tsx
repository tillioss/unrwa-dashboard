import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UNWRA Teacher Dashboard",
  description:
    "Administrator dashboard for teachers to monitor student assessments and progress",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  );
}
