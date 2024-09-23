import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./global.css";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import Header from "@/components/Header";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import Footer from "@/components/Footer";
import { AppProvider } from "@/provider/AppProvider";
import MyQueryClientProvider from "@/provider/QueryClientProvider";
import { Toaster } from "@/components/ui/sonner";
import { Breadcumbs } from "@/components/Breadcumbs";
import { cookies } from "next/headers";
import { validateToken } from "@/utils/api";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "INSW",
  description: "Sistem Indonesia National Single Window",
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = cookies();
  const token = cookieStore.get("access_token")?.value;
  const userInfo = await validateToken(token as string);
  
  return (
    <html lang="en">
      <MyQueryClientProvider>
        <AppProvider>
          <body className={cn("min-h-screen flex flex-col", inter.className)}>
            <Header />
            <main className="flex-1 ">
              <MaxWidthWrapper>
                {token && <Breadcumbs token={token} user={userInfo.data} />}
                {children}
              </MaxWidthWrapper>
            </main>
            <Toaster />
            <Footer />
          </body>
        </AppProvider>
      </MyQueryClientProvider>
    </html>
  );
}
