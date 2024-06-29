import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { Toaster } from "@/components/ui/toaster"
import NavBar from "@/components/NavBar";

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Send Message Secretly",
  description: "You can send message secretly without revealing your identity to user",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <body className={inter.className}>
         
          {children}
          <Toaster/>
        </body>
  
    </html>
  );
}
