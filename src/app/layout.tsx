import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/theme-provider";
import { NotificationProvider } from "./components/notification";
import { AiAssistant } from "./components/ai-assistant";

// Chỉ khởi tạo font Inter mà chúng ta thực sự sử dụng
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CIJIBI - Restaurant SaaS",
  description: "Modern Restaurant Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NotificationProvider>
            {children}
            <AiAssistant />
          </NotificationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
