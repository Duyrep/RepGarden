"use client";

import { useLiveQuery } from "dexie-react-hooks";
import {
  Activity,
  FolderOpen,
  HeartPulse,
  Info,
  PenLine,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Header } from "@/components/layout";
import { Button, Loading } from "@/components/ui";
import {
  MetricCard,
  MetricCardIcons,
  MetricValueType,
} from "@/components/ui/MetricCard";
import { appDB } from "@/db";

export default function AddMetric() {
  const [isLoading, setIsLoading] = useState(true);
  const treeId = Number(useParams().treeId);
  const projectId = Number(useParams().projectId);

  const [project, tree] = useLiveQuery(async () => {
    const project = await appDB.projects.get(projectId);
    const tree = await appDB.trees.get(treeId);
    setIsLoading(false);
    return [project, tree];
  }, [projectId, treeId]) ?? [undefined, undefined];

  const metrics = useLiveQuery(
    async () => await appDB.metrics.where("treeId").equals(treeId).toArray(),
    [treeId],
  );

  // Trạng thái Đang tải
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <Loading />
        <p className="text-surface-a40 font-medium animate-pulse">
          Đang tải chỉ số...
        </p>
      </div>
    );
  }

  // Trạng thái Lỗi / Không tìm thấy
  if (!project || !tree || !metrics) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground animate-fade-in p-4 text-center">
        <div className="w-24 h-24 bg-danger-a0/10 text-danger-a0 flex items-center justify-center rounded-full mb-6">
          <FolderOpen className="w-12 h-12" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Không tìm thấy dữ liệu
        </h2>
        <p className="text-surface-a50 mb-8 max-w-md">
          Chỉ số bạn đang tìm kiếm không tồn tại hoặc dữ liệu cây đã bị xóa.
        </p>
        <Link href="/my-projects">
          <Button className="bg-primary text-on-primary hover:bg-primary-a10 px-8 py-3 rounded-full shadow-sm transition-colors">
            Quay lại danh sách dự án
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col animate-fade-in overflow-x-hidden pb-24 sm:pb-8">
      <Header
        title="Quản lý chỉ số"
        href={`/project/${projectId}/tree/${treeId}`}
        variant="primary"
        className="sticky top-0 z-10 shadow-sm"
      />

      <main className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-8 flex flex-col gap-6 pt-[calc(var(--header-height)+1.5rem)]">
        {/* Tiêu đề & Công cụ (Chỉ hiện nút thêm trên Desktop) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 animate-slide-up">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary flex items-center gap-2">
              <Activity className="w-6 h-6 md:w-8 md:h-8" />
              Các chỉ số sinh trưởng
            </h1>
            <p className="text-surface-a50 text-sm mt-1">
              Theo dõi sự phát triển của{" "}
              <strong className="text-foreground">{tree.name}</strong>
            </p>
          </div>

          <Link href="metrics/add" className="hidden sm:block">
            <Button className="flex items-center gap-2 bg-primary text-on-primary hover:bg-primary-a10 shadow-sm rounded-full px-5 py-2.5 transition-colors">
              <Plus className="w-5 h-5" />
              Thêm chỉ số mới
            </Button>
          </Link>
        </div>

        {/* Nội dung danh sách chỉ số */}
        {metrics.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-surface-a0 border border-surface-a10 border-dashed rounded-3xl animate-slide-up [animation-delay:100ms]">
            <div className="w-20 h-20 bg-surface-tonal-a0 text-primary flex items-center justify-center rounded-full mb-6">
              <HeartPulse className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold mb-2">Chưa có chỉ số nào</h2>
            <p className="text-surface-a40 max-w-md mb-8">
              Bạn chưa theo dõi bất kỳ chỉ số sinh trưởng nào cho cây này (như
              chiều cao, độ ẩm, số lá...). Hãy thêm chỉ số đầu tiên!
            </p>
            <Link href="metrics/add">
              <Button className="flex items-center gap-2 bg-primary text-on-primary hover:bg-primary-a10 rounded-full px-6 py-3 shadow-sm transition-colors">
                <Plus className="w-5 h-5" />
                Thêm chỉ số
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mt-4">
            {metrics.map((metric, index) => (
              <div
                key={metric.id}
                className="animate-slide-up h-full flex flex-col"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* 
                  Sử dụng MetricCard của bạn và truyền thêm nút chỉnh sửa vào children.
                  Dùng lớp h-full để các card cao bằng nhau trong grid.
                */}
                <MetricCard {...metric}>
                  <div className="mt-auto pt-3 border-t border-surface-a10 w-full flex justify-end">
                    {/* Giả sử bạn sẽ có trang chỉnh sửa ở metrics/[metricId]/edit */}
                    <Button
                      variant="ghost"
                      className="text-surface-a40 hover:text-primary hover:bg-surface-a10 flex items-center gap-2 h-8 px-3 text-sm rounded-lg transition-colors"
                      aria-label="Chỉnh sửa chỉ số"
                    >
                      <PenLine className="w-4 h-4" />
                      Sửa
                    </Button>
                  </div>
                </MetricCard>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Nút FAB (Floating Action Button) - Chỉ hiện trên điện thoại */}
      <div className="sm:hidden fixed bottom-[calc(var(--bottom-navigation-height)+16px)] right-4 z-20">
        <Link href="metrics/add">
          <Button className="w-14 h-14 rounded-full bg-primary text-on-primary shadow-lg flex items-center justify-center hover:bg-primary-a10 transition-transform hover:scale-105 p-0">
            <Plus className="w-7 h-7" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
