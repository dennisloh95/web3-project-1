import Header from "@/components/Header";
import Providers from "@/components/Providers";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "@/components/toast";
import "@/styles/globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-slate-50 antialiased">
        <Providers>
          <Toaster position="bottom-right" />
          <div className="relative p-4 flex min-h-screen">
            <Sidebar />
            <div className="flex flex-col flex-1 max-sm:w-full ">
              <Header />
              <main className="w-full mx-auto grow">{children}</main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
