import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import "./globals.css";
import I18nProvider from "../components/I18nProvider";

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
    <html lang="en" dir="ltr">
      <body className={`${fredoka.className} bg-gray-50 min-h-screen`}>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
