import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "@/components/ui/toaster"
import NavBar from "@/components/NavBar";

const inter = Inter({ subsets: ["latin"] });
export const metadata = {
  title: 'Secret Message',
  description: 'You can send message without revealing your identity. all message are encrypted .',
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={inter.className}>
          <NavBar/>
          {children}
          <Toaster/>
        </body>
      </AuthProvider>
    </html>
  );
}
