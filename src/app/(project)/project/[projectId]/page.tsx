"use client";

import { useLiveQuery } from "dexie-react-hooks";
import {
  ChevronDown,
  Edit2,
  FolderOpen,
  Plus,
  Star,
  Trash2,
  TreePine,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { Header } from "@/components/layout";
import { Button, Input, Loading } from "@/components/ui";
import { appDB, type Tree } from "@/db";

export default function ProjectTrees() {
  const projectId = Number(useParams().projectId);

  const trees = useLiveQuery(async () => {
    if (Number.isNaN(projectId)) return [];
    return await appDB.trees.where("projectId").equals(projectId).toArray();
  }, [projectId]);

  const project = useLiveQuery(async () => {
    if (Number.isNaN(projectId)) return null;
    const p = await appDB.projects.get(projectId);
    return p ?? null;
  }, [projectId]);

  // Loading state
  if (project === undefined || trees === undefined)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <Loading />
        <p className="text-surface-a40 font-medium animate-pulse">
          Đang tải dữ liệu...
        </p>
      </div>
    );

  if (!project) return <ProjectNotFound />;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col animate-fade-in overflow-x-hidden">
      {/* Giữ nguyên component Header của bạn */}
      <Header
        href="/my-projects"
        title={project.name || "Chọn cây"}
        className="bg-primary text-on-primary sticky top-0 z-10 shadow-sm"
        variant="primary"
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 flex flex-col gap-6">
        {/* Thanh công cụ (Ẩn nút thêm trên mobile, dùng FAB ở dưới cùng) */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl md:text-2xl font-bold text-surface-a50 flex items-center gap-2">
            <TreePine className="w-6 h-6 text-primary" />
            Danh sách cây
          </h2>
          <Link href={`/project/${projectId}/add`} className="hidden sm:flex">
            <Button className="flex items-center gap-2 bg-primary text-on-primary hover:bg-primary-a10 shadow-sm rounded-full px-5 py-2 transition-colors">
              <Plus className="w-5 h-5" />
              Thêm cây mới
            </Button>
          </Link>
        </div>

        {/* Nội dung danh sách cây */}
        {trees.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-surface-a0 border border-surface-a10 border-dashed rounded-3xl animate-slide-up [animation-delay:100ms]">
            <div className="w-20 h-20 bg-surface-tonal-a0 text-primary flex items-center justify-center rounded-full mb-6">
              <TreePine className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold mb-2">Chưa có cây nào</h2>
            <p className="text-surface-a40 max-w-md mb-8">
              Dự án này chưa có cây dữ liệu nào. Hãy tạo một cây mới để bắt đầu
              thiết kế luồng của bạn.
            </p>
            <Link href={`/project/${projectId}/add`}>
              <Button className="flex items-center gap-2 bg-primary text-on-primary hover:bg-primary-a10 rounded-full px-6 py-3 shadow-sm transition-colors">
                <Plus className="w-5 h-5" />
                Thêm cây đầu tiên
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 pb-24 sm:pb-4">
            {/* 1. Thêm [...] để tạo bản sao (copy) của mảng trước khi sort */}
            {[...trees]
              .sort((a, b) => {
                // 2. Ép kiểu an toàn: Nếu undefined thì mặc định là 0 (không có sao)
                // Nếu có sao (true) thì là 1
                const starA = a.starred ? 1 : 0;
                const starB = b.starred ? 1 : 0;

                // Sắp xếp theo sao: 1 lên trước, 0 xuống sau
                if (starA !== starB) {
                  return starB - starA;
                }

                // 3. Nếu trạng thái sao giống nhau, sắp xếp theo tên (A -> Z)
                // Đề phòng a.name bị undefined (dù theo interface là bắt buộc)
                const nameA = a.name || "";
                const nameB = b.name || "";
                return nameA.localeCompare(nameB);
              })
              .map((tree, index) => (
                <TreeItem
                  key={`tree-${tree.id}`}
                  {...{ ...tree, projectId }}
                  index={index}
                />
              ))}
          </div>
        )}
      </main>

      {/* Nút FAB (Floating Action Button) thêm cây mới cho điện thoại */}
      <div className="sm:hidden fixed bottom-[calc(var(--bottom-navigation-height)+16px)] right-4 z-20">
        <Link href={`/project/${projectId}/add`}>
          <Button className="w-14 h-14 rounded-full bg-primary text-on-primary shadow-lg flex items-center justify-center hover:bg-primary-a10 transition-transform hover:scale-105 p-0">
            <Plus className="w-7 h-7" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

function TreeItem({
  projectId,
  id,
  name,
  starred,
  index,
}: Tree & { projectId: number; index?: number }) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isExtend, setIsExtend] = useState(false);
  const [editedName, setEditedName] = useState("");

  if (!id) return;

  const star = () => appDB.trees.update(id, { starred: !starred });
  const rename = () => {
    if (editedName.trim()) {
      appDB.trees.update(id, { name: editedName.trim() });
    }
    setIsEditingName(false);
  };
  const deleteTree = () => {
    if (confirm(`Bạn có chắc chắn muốn xóa "${name}"?`)) {
      appDB.trees.delete(id);
    }
  };

  return (
    <div
      className="flex flex-col bg-surface-a0 shadow-sm border border-surface-a10 rounded-2xl w-full h-min duration-300 hover:shadow-md animate-slide-up overflow-hidden"
      style={{ animationDelay: `${(index || 0) * 50}ms` }}
    >
      <div className="flex items-center justify-between p-3 gap-2">
        <div className="flex items-center flex-1 gap-2 overflow-hidden">
          {/* Biểu tượng cây hoặc sao chói lọi */}
          {starred ? (
            <Star className="w-5 h-5 text-warning-a10 fill-warning-a10 flex-shrink-0" />
          ) : (
            <TreePine className="w-5 h-5 text-surface-a40 flex-shrink-0" />
          )}

          {isEditingName ? (
            <Input
              className="flex-1 min-w-0 p-1.5 font-semibold text-base border-primary"
              defaultValue={name}
              autoFocus
              onFocus={(e) => e.target.select()}
              onChange={(e) => setEditedName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") rename();
                if (e.key === "Escape") setIsEditingName(false);
              }}
            />
          ) : (
            <Link
              href={`/project/${projectId}/tree/${id}`}
              className="font-semibold text-lg text-foreground hover:text-primary transition-colors truncate w-full py-1"
              title={name}
            >
              {name}
            </Link>
          )}
        </div>

        {/* Nút Dropdown */}
        <Button
          variant="ghost"
          className={twMerge(
            "flex-none p-2 rounded-full transition-all text-surface-a40 hover:text-foreground hover:bg-surface-a10",
            isExtend && "bg-surface-a10 text-primary",
          )}
          onClick={() => setIsExtend(!isExtend)}
          aria-label="Tùy chọn"
        >
          <ChevronDown
            className={twMerge(
              "w-5 h-5 duration-300",
              isExtend ? "rotate-180" : "rotate-0",
            )}
          />
        </Button>
      </div>

      {/* Bảng Hành Động Mở Rộng - CSS mượt mà */}
      <div
        className={twMerge(
          "w-full bg-surface-tonal-a0 transition-all duration-300 ease-in-out border-t",
          isExtend
            ? "max-h-20 opacity-100 border-surface-a10"
            : "max-h-0 opacity-0 border-t-transparent",
        )}
      >
        <div className="p-3 flex items-center justify-between gap-2">
          {isEditingName ? (
            <div className="flex gap-2 w-full justify-end">
              <Button
                variant="outline"
                className="text-sm py-1.5 h-auto px-4 bg-surface-a0 border-surface-a20"
                onClick={() => setIsEditingName(false)}
              >
                Hủy
              </Button>
              <Button
                className="text-sm py-1.5 h-auto px-4 bg-primary text-on-primary hover:bg-primary-a10"
                onClick={rename}
              >
                Lưu
              </Button>
            </div>
          ) : (
            <>
              <Button
                variant="ghost"
                className={twMerge(
                  "flex-1 flex items-center justify-center gap-2 text-sm py-1.5 h-auto rounded-lg transition-colors",
                  starred
                    ? "text-warning-a10 hover:bg-warning-a0/10"
                    : "text-surface-a50 hover:text-foreground hover:bg-surface-a10",
                )}
                onClick={star}
              >
                <Star
                  className={twMerge("w-4 h-4", starred && "fill-warning-a10")}
                />
                <span className="hidden sm:inline">
                  {starred ? "Bỏ sao" : "Gắn sao"}
                </span>
              </Button>

              <div className="flex-1 flex gap-1">
                <Button
                  variant="ghost"
                  className="flex-1 flex items-center justify-center gap-2 text-sm py-1.5 h-auto rounded-lg text-surface-a50 hover:text-primary hover:bg-surface-a10 transition-colors"
                  onClick={() => {
                    setIsEditingName(true);
                    setEditedName(name);
                  }}
                >
                  <Edit2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Sửa</span>
                </Button>
                <Button
                  variant="ghost"
                  className="flex-1 flex items-center justify-center gap-2 text-sm py-1.5 h-auto rounded-lg text-danger-a0 hover:bg-danger-a0 hover:text-white transition-colors"
                  onClick={deleteTree}
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Xóa</span>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ProjectNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground animate-fade-in p-4 text-center">
      <div className="w-24 h-24 bg-danger-a0/10 text-danger-a0 flex items-center justify-center rounded-full mb-6">
        <FolderOpen className="w-12 h-12" />
      </div>
      <h2 className="text-2xl md:text-3xl font-bold mb-4">
        Không tìm thấy dự án
      </h2>
      <p className="text-surface-a50 mb-8 max-w-md">
        Dự án bạn đang truy cập không tồn tại hoặc đã bị xóa. Vui lòng kiểm tra
        lại.
      </p>
      <Link href="/my-projects">
        <Button className="bg-primary text-on-primary hover:bg-primary-a10 px-8 py-3 rounded-full shadow-sm transition-colors">
          Quay lại danh sách dự án
        </Button>
      </Link>
    </div>
  );
}
