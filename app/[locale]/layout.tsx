import type { Metadata } from "next";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { getMessages } from "next-intl/server";
import { Providers } from "@/providers/providers";

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
    <html lang={locale} suppressHydrationWarning>
      <body suppressHydrationWarning className="custom-scrollbar">
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
          <Providers locale={locale} messages={messages}>
            {children}
          </Providers>
        </div>
      </body>
    </html>
  );
}
