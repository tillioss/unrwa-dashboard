import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tilli Teacher Dashboard",
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
      <body className={`${fredoka.className} bg-gray-50 min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
