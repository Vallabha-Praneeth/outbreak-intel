import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { Providers } from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Outbreak Intel | QuantumOps",
  description: "Global health intelligence & early signal detection dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <div className="flex h-screen overflow-hidden bg-background">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
              <Topbar />
              <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                {children}
              </main>
              <footer className="h-10 border-t border-border bg-surface-0 flex items-center justify-between px-6 text-[10px] text-muted-foreground/60 uppercase tracking-widest font-semibold">
                <span>© {new Date().getFullYear()} Outbreak Intel</span>
                <span>Powered by QuantumOps Private Limited</span>
              </footer>
            </div>
          </div>
          <div className="noise-overlay" />
        </Providers>
      </body>
    </html>
  );
}
