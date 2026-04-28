"use client";

import {
  ArrowRight,
  Clock,
  FolderKanban,
  LayoutDashboard,
  Plus,
} from "lucide-react";
import Link from "next/link";

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
  Input,
  Textarea,
} from "@/components/ui";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col p-4 md:p-8 animate-fade-in overflow-x-hidden">
      <main className="flex-1 max-w-5xl w-full mx-auto flex flex-col justify-center py-10 md:py-16 space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-6 animate-slide-up px-2 sm:px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-primary leading-tight">
            Quản lý công việc hiệu quả
          </h1>
          <p className="text-base sm:text-lg text-surface-a50 max-w-2xl mx-auto">
            Theo dõi, tổ chức và hoàn thành các dự án của bạn một cách dễ dàng
            với không gian làm việc được thiết kế tối ưu.
          </p>

          {/* Action Buttons: Căn dọc (tràn viền) trên điện thoại, nằm ngang trên tablet/PC */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-6 w-full max-w-md mx-auto sm:max-w-none">
            <Link href="/my-projects" className="w-full sm:w-auto" passHref>
              <Button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-on-primary hover:bg-primary-a10 py-6 sm:py-3 rounded-xl sm:rounded-full transition-all shadow-sm">
                <FolderKanban className="w-5 h-5" />
                Dự án của tôi
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>

            {/* Dialog Tạo dự án mới sử dụng UI Component của bạn */}
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-surface-a0 text-primary border border-surface-a20 hover:bg-surface-a10 py-6 sm:py-3 rounded-xl sm:rounded-full transition-all shadow-sm">
                  <Plus className="w-5 h-5" />
                  Tạo dự án mới
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-md">
                <DialogTitle className="text-xl font-bold text-primary">
                  Tạo dự án mới
                </DialogTitle>
                <DialogDescription className="text-surface-a40">
                  Thiết lập không gian làm việc mới để bắt đầu ý tưởng của bạn.
                </DialogDescription>

                <div className="flex flex-col gap-4 mt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Tên dự án <span className="text-danger-a0">*</span>
                    </label>
                    <Input
                      placeholder="Vd: RepConnect, RepGarden..."
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Mô tả
                    </label>
                    <Textarea
                      placeholder="Chi tiết về dự án..."
                      rows={3}
                      className="w-full resize-none"
                    />
                  </div>
                </div>

                <DialogFooter className="mt-6 flex flex-col-reverse sm:flex-row gap-2">
                  <DialogClose asChild>
                    <Button className="w-full sm:w-auto bg-surface-a10 text-foreground hover:bg-surface-a20">
                      Hủy
                    </Button>
                  </DialogClose>
                  <Button className="w-full sm:w-auto bg-primary text-on-primary hover:bg-primary-a10">
                    Bắt đầu ngay
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Features Section - Tự động xuống dòng 1 cột trên ĐT, 3 cột trên PC */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 text-left">
          {/* Feature 1 */}
          <div
            className="bg-surface-a0 p-6 rounded-2xl shadow-sm border border-surface-a10 animate-slide-up"
            style={{ animationDelay: "100ms" }}
          >
            <div className="w-12 h-12 bg-surface-tonal-a0 text-primary flex items-center justify-center rounded-xl mb-4">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Tổng quan trực quan</h3>
            <p className="text-surface-a40 text-sm leading-relaxed">
              Xem toàn bộ tiến độ, thống kê và tình trạng của các dự án ngay
              trên một bảng điều khiển duy nhất.
            </p>
          </div>

          {/* Feature 2 */}
          <div
            className="bg-surface-a0 p-6 rounded-2xl shadow-sm border border-surface-a10 animate-slide-up"
            style={{ animationDelay: "200ms" }}
          >
            <div className="w-12 h-12 bg-surface-tonal-a0 text-success-a0 flex items-center justify-center rounded-xl mb-4">
              <FolderKanban className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Quản lý dễ dàng</h3>
            <p className="text-surface-a40 text-sm leading-relaxed">
              Phân loại, gán nhãn và theo dõi từng hạng mục công việc để không
              bỏ lỡ bất kỳ chi tiết nào.
            </p>
          </div>

          {/* Feature 3 */}
          <div
            className="bg-surface-a0 p-6 rounded-2xl shadow-sm border border-surface-a10 animate-slide-up sm:col-span-2 md:col-span-1"
            style={{ animationDelay: "300ms" }}
          >
            <div className="w-12 h-12 bg-surface-tonal-a0 text-warning-a0 flex items-center justify-center rounded-xl mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Tiết kiệm thời gian</h3>
            <p className="text-surface-a40 text-sm leading-relaxed">
              Tối ưu hóa quy trình làm việc với các công cụ thông minh, giúp bạn
              tập trung vào điều quan trọng nhất.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
