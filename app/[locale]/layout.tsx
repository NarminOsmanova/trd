import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Report - Layihə İdarəetmə və Xərclərin Hesabat Sistemi",
  description: "Layihə idarəetməsi və xərclərin hesabat sistemi",
};
export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "az" }, { locale: "ru" }];
}

export default async function RootLayout({
  params,
  children,
}: Readonly<{
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
}>) {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  return (
    <html lang={locale}>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning={true}>
        <NextIntlClientProvider messages={messages}>
        <AuthProvider>
          {children}
        </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
