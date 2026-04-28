/** biome-ignore-all lint/a11y/noLabelWithoutControl: <explanation> */
"use client";

import { useLiveQuery } from "dexie-react-hooks";
import {
  ArrowLeft,
  Calendar,
  DownloadCloud,
  FolderKanban,
  FolderPlus,
  Loader2,
  Plus,
  Trash2,
  UploadCloud,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
  Input,
  Loading,
} from "@/components/ui";
import { appDB } from "@/db";

export default function MyProject() {
  const projects = useLiveQuery(() =>
    appDB.projects.orderBy("id").reverse().toArray(),
  );

  const [isExporting, setIsExporting] = useState(false);

  // Hàm hỗ trợ format ngày tháng
  const formatDate = (isoString?: string) => {
    if (!isoString) return "Không xác định";
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  // Hàm xử lý xuất dữ liệu
  const handleExportData = async () => {
    try {
      setIsExporting(true);

      // 1. Import động thư viện ngay tại đây (chỉ chạy trên client)
      await import("dexie-export-import");

      // 2. appDB.export() bây giờ đã khả dụng
      const blob = await appDB.export();

      // 3. Tạo URL ảo để tải file
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `rep-garden-backup-${new Date().toISOString().slice(0, 10)}.json`;

      // 4. Kích hoạt tải về
      document.body.appendChild(link);
      link.click();

      // 5. Dọn dẹp bộ nhớ
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Lỗi khi xuất dữ liệu:", error);
      alert("Đã xảy ra lỗi khi xuất dữ liệu. Vui lòng thử lại!");
    } finally {
      setIsExporting(false);
    }
  };

  // Trạng thái đang tải (Loading)
  if (projects === undefined) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <Loading />
        <p className="text-surface-a40 font-medium animate-pulse">
          Đang tải dự án...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8 overflow-x-hidden">
      <main className="max-w-5xl mx-auto flex flex-col gap-8 animate-fade-in">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-surface-a10 pb-6">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 bg-surface-a0 hover:bg-surface-a10 rounded-full border border-surface-a10 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-surface-a50" />
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-primary flex items-center gap-2">
                <FolderKanban className="w-7 h-7" />
                Dự án của tôi
              </h1>
              <p className="text-sm text-surface-a40 mt-1">
                {projects.length} dự án đang hoạt động
              </p>
            </div>
          </div>

          {/* Action Buttons - Tối ưu cho Mobile (Xếp hàng ngang trên điện thoại) */}
          <div className="flex flex-col sm:flex-row items-center w-full md:w-auto gap-2 sm:gap-3">
            <div className="flex w-full sm:w-auto gap-2">
              <ImportProjectDialog />

              <Button
                variant="outline"
                onClick={handleExportData}
                disabled={isExporting}
                className="flex-1  bg-surface-a0 border-surface-a20 text-foreground hover:bg-surface-a10 hover:text-primary flex items-center justify-center gap-2 px-4 shadow-sm disabled:opacity-50"
              >
                {isExporting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <DownloadCloud className="w-4 h-4" />
                )}
                <span>{isExporting ? "Đang xuất..." : "Xuất"}</span>
              </Button>
            </div>

            <div className="w-full sm:w-auto mt-2 sm:mt-0">
              <AddProject />
            </div>
          </div>
        </header>

        {/* Nội dung chính */}
        {projects.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-surface-a0 border border-surface-a10 border-dashed rounded-3xl animate-slide-up">
            <div className="w-20 h-20 bg-surface-tonal-a0 text-primary flex items-center justify-center rounded-full mb-6">
              <FolderPlus className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold mb-2">Chưa có dự án nào</h2>
            <p className="text-surface-a40 max-w-md mb-8">
              Bạn chưa tạo dự án nào. Hãy bắt đầu bằng cách tạo một không gian
              làm việc mới để theo dõi công việc của mình, hoặc Nhập dữ liệu từ
              bản sao lưu.
            </p>
            <AddProject />
          </div>
        ) : (
          // Grid Danh sách dự án
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className="group flex flex-col bg-surface-a0 border border-surface-a10 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 animate-slide-up hover:-translate-y-1 relative"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Link
                  href={`/project/${project.id}`}
                  className="flex-1 flex flex-col gap-2 focus:outline-none pr-8"
                >
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {project.name}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-surface-a40 mt-auto pt-4">
                    <Calendar className="w-4 h-4" />
                    <span>Tạo ngày: {formatDate(project.createdAt)}</span>
                  </div>
                </Link>

                {/* Nút xóa */}
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    if (
                      confirm(
                        `Bạn có chắc muốn xóa dự án "${project.name}"? Dữ liệu bên trong sẽ bị mất vĩnh viễn.`,
                      ) &&
                      project.id
                    ) {
                      appDB.projects.delete(project.id);
                    }
                  }}
                  className="absolute top-4 right-4 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity bg-danger-a0/10 hover:bg-danger-a10 text-danger-a0 hover:text-white p-2.5 rounded-xl h-auto w-auto"
                  aria-label="Xóa dự án"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function AddProject() {
  const [name, setName] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await appDB.projects.add({
        name: name,
        createdAt: new Date().toISOString(),
      });
      setName("");
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-on-primary hover:bg-primary-a10 rounded-xl px-5 py-2.5 transition-colors shadow-sm">
          <Plus className="w-5 h-5" />
          <span>Tạo dự án mới</span>
        </Button>
      </DialogTrigger>

      <DialogContent aria-describedby={undefined} className="sm:max-w-md">
        <DialogTitle className="text-xl font-bold text-primary mb-2">
          Thêm dự án
        </DialogTitle>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="space-y-2">
            <label
              htmlFor="projectName"
              className="text-sm font-medium text-foreground"
            >
              Tên dự án <span className="text-danger-a0">*</span>
            </label>
            <Input
              id="projectName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên dự án (VD: Ứng dụng Web...)"
              autoFocus
              className="w-full"
            />
          </div>

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
            <Button
              type="button"
              onClick={() => setIsOpen(false)}
              className="w-full sm:w-auto bg-surface-a10 text-foreground hover:bg-surface-a20"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={!name.trim()}
              className="w-full sm:w-auto bg-primary text-on-primary hover:bg-primary-a10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Lưu dự án
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ImportProjectDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const handleImport = async () => {
    if (!file) return;
    setIsImporting(true);

    try {
      // 1. Import động thư viện để tránh lỗi "self is not defined"
      await import("dexie-export-import");

      // 2. Thực hiện import với tuỳ chọn xoá sạch bảng trước khi ghi đè
      await appDB.import(file, { clearTablesBeforeImport: true });

      alert("Nhập dữ liệu thành công!");
      setIsOpen(false);
      setFile(null); // Reset lại file
    } catch (error) {
      console.error("Lỗi khi nhập dữ liệu:", error);
      alert(
        "File không hợp lệ hoặc có lỗi xảy ra trong quá trình đọc dữ liệu.",
      );
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-surface-a0 border-surface-a20 text-foreground hover:bg-surface-a10 hover:text-primary flex items-center justify-center gap-2 px-4 shadow-sm"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Nhập</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogTitle className="text-xl font-bold text-primary mb-2">
          Nhập dữ liệu
        </DialogTitle>

        <div className="flex flex-col gap-4">
          <div className="p-4 bg-danger-a0/10 text-danger-a0 border border-danger-a0/20 rounded-xl text-sm leading-relaxed">
            <strong className="font-bold flex items-center gap-1 mb-1">
              Cảnh báo nguy hiểm:
            </strong>
            Hành động này sẽ <b>xoá toàn bộ</b> dữ liệu dự án hiện tại trên
            thiết bị của bạn và thay thế bằng dữ liệu từ file sao lưu.
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Chọn file sao lưu (.json)
            </label>
            <Input
              type="file"
              accept=".json"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full cursor-pointer file:cursor-pointer file:bg-primary/10 file:text-primary file:border-0 file:rounded-md file:mr-4 file:px-4 file:py-2"
            />
          </div>
        </div>

        <DialogFooter className="mt-6 flex flex-col-reverse sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setIsOpen(false);
              setFile(null); // Clear file khi huỷ
            }}
            className="w-full sm:w-auto bg-surface-a10 text-foreground hover:bg-surface-a20"
          >
            Hủy
          </Button>
          <Button
            onClick={handleImport}
            disabled={!file || isImporting}
            className="w-full sm:w-auto bg-danger-a0 text-white hover:bg-danger-a10 disabled:opacity-50"
          >
            {isImporting ? "Đang xử lý..." : "Xác nhận ghi đè"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
