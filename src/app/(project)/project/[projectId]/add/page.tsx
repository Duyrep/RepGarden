"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { BookOpen, FolderOpen, PenLine, Plus, Sprout } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Header } from "@/components/layout";
import { Button, Input, Loading, Textarea } from "@/components/ui";
import { type Tree, appDB } from "@/db";

export default function Add() {
  const projectId = Number(useParams().projectId);
  const pathname = usePathname();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [tree, setTree] = useState<Tree>({
    projectId,
    name: "",
    scientificName: "",
    note: "",
    createdAt: new Date().toISOString(),
  });

  const project = useLiveQuery(async () => {
    const data = await appDB.projects.get(projectId);
    setIsLoading(false);
    return data;
  });

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!tree.name?.trim()) return;

    try {
      await appDB.trees.add(tree);
      // Quay lại trang danh sách cây của dự án
      router.push(pathname.split("/").slice(0, -1).join("/") || "/");
    } catch (error) {
      console.error("Lỗi khi thêm cây:", error);
    }
  };

  // Trạng thái Loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <Loading />
        <p className="text-surface-a40 font-medium animate-pulse">
          Đang tải thông tin dự án...
        </p>
      </div>
    );
  }

  // Trạng thái không tìm thấy dự án
  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground animate-fade-in p-4 text-center">
        <div className="w-24 h-24 bg-danger-a0/10 text-danger-a0 flex items-center justify-center rounded-full mb-6">
          <FolderOpen className="w-12 h-12" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Không tìm thấy dự án
        </h2>
        <p className="text-surface-a50 mb-8 max-w-md">
          Dự án bạn muốn thêm cây không tồn tại hoặc đã bị xóa.
        </p>
        <Link href="/my-projects">
          <Button className="bg-primary text-on-primary hover:bg-primary-a10 px-8 py-3 rounded-full shadow-sm transition-colors">
            Quay lại danh sách
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col animate-fade-in overflow-x-hidden">
      <Header
        title="Thêm cây mới"
        href="./"
        variant="primary"
        className="bg-primary text-on-primary sticky top-0 z-10 shadow-sm"
      />

      <main className="flex-1 w-full max-w-2xl mx-auto p-4 md:p-8 flex flex-col justify-center">
        <div className="bg-surface-a0 p-6 md:p-8 rounded-2xl shadow-sm border border-surface-a10 animate-slide-up">
          <div className="mb-6 text-center sm:text-left">
            <h2 className="text-2xl font-bold text-primary flex items-center justify-center sm:justify-start gap-2">
              <Sprout className="w-6 h-6" />
              Thông tin cây
            </h2>
            <p className="text-surface-a40 text-sm mt-1">
              Thuộc dự án:{" "}
              <strong className="text-foreground">{project.name}</strong>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Tên cây (Bắt buộc) */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Sprout className="w-4 h-4 text-primary" />
                Tên cây <span className="text-danger-a0">*</span>
              </label>
              <Input
                placeholder="Nhập tên cây..."
                value={tree.name}
                onChange={(e) =>
                  setTree((prev) => ({ ...prev, name: e.target.value }))
                }
                autoFocus
                className="w-full"
              />
            </div>

            {/* Tên khoa học */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <BookOpen className="w-4 h-4 text-primary" />
                Tên khoa học
              </label>
              <Input
                placeholder="Nhập tên khoa học (không bắt buộc)..."
                value={tree.scientificName || ""}
                onChange={(e) =>
                  setTree((prev) => ({
                    ...prev,
                    scientificName: e.target.value,
                  }))
                }
                className="w-full"
              />
            </div>

            {/* Ghi chú */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <PenLine className="w-4 h-4 text-primary" />
                Ghi chú
              </label>
              <Textarea
                placeholder="Đặc điểm, tình trạng, vị trí..."
                value={tree.note || ""}
                onChange={(e) =>
                  setTree((prev) => ({ ...prev, note: e.target.value }))
                }
                rows={4}
                className="w-full resize-none"
              />
            </div>

            {/* Nút hành động */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-4 pt-4 border-t border-surface-a10">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  router.push(pathname.split("/").slice(0, -1).join("/") || "/")
                }
                className="w-full sm:w-auto bg-surface-a0 text-foreground border-surface-a20 hover:bg-surface-a10"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={!tree.name?.trim()}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-on-primary hover:bg-primary-a10 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-5 h-5" />
                Thêm cây
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
