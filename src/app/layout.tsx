import type { Metadata } from "next";
import "@/styles/globals.css"; // Đảm bảo tệp này tồn tại theo Verbatim
import GarbageCollector from "@/components/GarbageCollector";
import Providers from "@/components/Providers";
import "react-ripple-click/dist/index.css";

// Metadata chỉ hoạt động trong Server Component
export const metadata: Metadata = {
  title: "RepGarden - Quản lý cây trồng",
  description: "Ứng dụng theo dõi và chăm sóc cây trồng thông minh",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="font-sans antialiased">
        <Providers>
          {/* Component chạy ngầm dọn dẹp dữ liệu rác ở Client */}
          <GarbageCollector />

          {children}
        </Providers>
      </body>
    </html>
  );
}
