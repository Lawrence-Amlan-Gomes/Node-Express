import type { Metadata } from "next";
import Sidebar from "@/components/Sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Node + Express Playground — Co-Founder Mentor App",
  description: "A hands-on Node.js + Express backend learning playground, from the event loop to a senior-level backend interview.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen bg-bg antialiased">
        <Sidebar />
        <main className="flex-1 min-w-0 max-w-220 mx-auto px-8 pt-10 pb-24">{children}</main>
      </body>
    </html>
  );
}
