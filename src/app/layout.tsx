import type { Metadata } from "next";
import { Inter } from "next/font/google";
// import Link from "next/link";
import "./globals.css";
import { AuthProvider } from '@/contexts/auth-context';
import { NavigationMenu } from '@/components/NavigationMenu';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AIPLAXE - AI Worker Marketplace",
  description: "Browse and run AI agents for various tasks",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <NavigationMenu />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
