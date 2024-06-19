import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import Providers from "@/context/providers";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const inter = Lora({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tube Analyzer",
  description: "analyze and chat with any youtube video",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Providers>
        <body>
          <Header />
          {children}
          <Footer />
        </body>
      </Providers>
    </html>
  );
}
