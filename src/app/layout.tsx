import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "하모니 - 액티브 시니어 라이프 플랫폼",
  description: "취미·정보 기반 55~70세 시니어를 위한 클럽 활동 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-background font-sans antialiased">{children}</body>
    </html>
  );
}
