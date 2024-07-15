import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "縦書きエディター",
  description: "web上の無料の縦書きエディターです",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={cn("flex min-h-screen flex-col", "print:min-h-0 print:w-max")}>
        {children} <Toaster />
      </body>
    </html>
  );
}
