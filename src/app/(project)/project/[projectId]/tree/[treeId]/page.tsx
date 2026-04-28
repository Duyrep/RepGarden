"use client";

import { useLiveQuery } from "dexie-react-hooks";
import {
  Activity,
  ArrowRight,
  BookOpen,
  Camera,
  Image as ImageIcon,
  Leaf,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Header } from "@/components/layout";
import { Button, Loading } from "@/components/ui";
import { MetricCard } from "@/components/ui/MetricCard";
import { appDB, type DailyMoment } from "@/db";

export default function ProjectPage() {
  const projectId = Number(useParams().projectId as string);
  const treeId = Number(useParams().treeId as string);

  const [isLoading, setIsLoading] = useState(true);

  const tree = useLiveQuery(async () => await appDB.trees.get(treeId));
  const metrics = useLiveQuery(
    async () => await appDB.metrics.where("treeId").equals(treeId).toArray(),
  );
  const project = useLiveQuery(async () => {
    const data = await appDB.projects.get(projectId);
    setIsLoading(false);
    return data;
  }, [projectId]);
  const dailyMoments = useLiveQuery(async () => {
    return await appDB.dailyMoments.where("treeId").equals(treeId).toArray();
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <Loading />
        <p className="text-surface-a40 font-medium animate-pulse">
          Đang tải dữ liệu cây...
        </p>
      </div>
    );
  }

  if (!project || !tree) return <TreeNotFound projectId={projectId} />;

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 overflow-x-hidden">
      <Header
        title={project.name}
        href={`/project/${projectId}`}
        variant="primary"
        className="sticky top-0 z-10 shadow-sm"
      />

      <main className="max-w-5xl mx-auto p-4 md:p-8 flex flex-col gap-8 animate-fade-in pt-[calc(var(--header-height)+1.5rem)]">
        {/* Banner chính của Cây */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary to-primary-to-mint rounded-3xl p-6 md:p-8 text-on-primary shadow-md animate-slide-up">
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-2xl mb-2 backdrop-blur-sm">
                <Leaf className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">{tree.name}</h1>
              {tree.scientificName && (
                <p className="text-white/80 italic text-lg">
                  {tree.scientificName}
                </p>
              )}
            </div>

            <Link
              href={`/project/${projectId}/tree/${treeId}/daily/add`}
              className="w-full sm:w-auto"
            >
              <Button className="w-full sm:w-auto bg-white text-primary hover:bg-surface-a10 font-semibold rounded-full px-6 py-3 shadow-sm transition-transform hover:scale-105 flex items-center justify-center gap-2">
                <Camera className="w-5 h-5" />
                Viết nhật ký hôm nay
              </Button>
            </Link>
          </div>
          {/* Họa tiết trang trí nền (Tùy chọn) */}
          <Leaf className="absolute -bottom-10 -right-10 w-48 h-48 text-white opacity-10 pointer-events-none" />
        </div>

        {/* Khu vực 1: Chỉ số sinh trưởng */}
        <section className="flex flex-col gap-4 animate-slide-up [animation-delay:100ms]">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
              <Activity className="w-5 h-5 text-primary" />
              Chỉ số sức khỏe
            </h2>
            {metrics && metrics.length > 0 && (
              <Link
                href={`${treeId}/metrics`}
                className="text-sm font-medium text-primary hover:text-primary-a20 flex items-center gap-1 transition-colors"
              >
                Xem tất cả <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {metrics?.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center p-8 bg-surface-a0 border border-surface-a10 border-dashed rounded-2xl text-center">
                <p className="text-surface-a50 mb-4">
                  Chưa có chỉ số nào được theo dõi.
                </p>
                <Link href={`${treeId}/metrics/add`}>
                  <Button
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary/10 rounded-full"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Thêm chỉ số đầu tiên
                  </Button>
                </Link>
              </div>
            ) : (
              metrics
                ?.slice(0, 4)
                ?.map((metric) => <MetricCard key={metric.id} {...metric} />)
            )}
          </div>
        </section>

        {/* Khu vực 2: Nhật ký ảnh hằng ngày */}
        <section className="flex flex-col gap-4 animate-slide-up [animation-delay:200ms]">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
              <Camera className="w-5 h-5 text-primary" />
              Nhật ký hình ảnh
            </h2>
          </div>

          <div className="bg-surface-a0 rounded-2xl border border-surface-a10 p-4 md:p-6 shadow-sm">
            {dailyMoments?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-16 h-16 bg-surface-tonal-a0 text-primary flex items-center justify-center rounded-full mb-4">
                  <ImageIcon className="w-8 h-8" />
                </div>
                <p className="text-surface-a50 mb-6 max-w-sm">
                  Ghi lại khoảnh khắc lớn lên mỗi ngày của cây để tạo thành một
                  hành trình tuyệt vời.
                </p>
                <Link href={`${treeId}/daily/add`}>
                  <Button className="bg-primary text-on-primary hover:bg-primary-a10 rounded-full px-6">
                    <Plus className="w-4 h-4 mr-2" /> Thêm nhật ký
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {dailyMoments?.map((dailyMoment) => (
                  <MomentItem key={dailyMoment.id} dailyMoment={dailyMoment} />
                ))}
                {/* Nút thêm nhanh nằm ở cuối grid */}
                <Link href={`${treeId}/daily/add`} className="h-full">
                  <div className="flex flex-col items-center justify-center h-full min-h-[200px] border-2 border-dashed border-surface-a20 rounded-xl text-surface-a40 hover:text-primary hover:border-primary hover:bg-primary/5 transition-all cursor-pointer">
                    <Plus className="w-8 h-8 mb-2" />
                    <span className="font-medium">Thêm ảnh mới</span>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Khu vực 3: Ghi chú */}
        {tree.note && (
          <section className="flex flex-col gap-4 animate-slide-up [animation-delay:300ms]">
            <h2 className="text-xl font-bold flex items-center gap-2 text-foreground">
              <BookOpen className="w-5 h-5 text-primary" />
              Ghi chú về cây
            </h2>
            <div className="bg-[#fff9c4] text-[#827717] p-5 rounded-2xl shadow-sm border border-[#fff59d] whitespace-pre-wrap leading-relaxed">
              {tree.note}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function TreeNotFound({ projectId }: { projectId: number }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
      <Leaf className="w-16 h-16 text-surface-a40 mb-4" />
      <h2 className="text-2xl font-bold mb-2">Không tìm thấy dữ liệu</h2>
      <p className="text-surface-a50 mb-6">
        Cây bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
      </p>
      <Link href={`/project/${projectId}`}>
        <Button className="bg-primary text-on-primary rounded-full px-6">
          Quay lại danh sách
        </Button>
      </Link>
    </div>
  );
}

const MomentItem = ({ dailyMoment }: { dailyMoment: DailyMoment }) => {
  const treeId = Number(useParams().treeId as string);
  const [imgUrl, setImgUrl] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (!dailyMoment.images || dailyMoment.images.length === 0) return;
      const image = await appDB.images.get(dailyMoment.images[0]);
      if (image && isMounted) {
        setImgUrl(URL.createObjectURL(image.file));
      }
    };

    loadData();

    return () => {
      isMounted = false;
      if (imgUrl) URL.revokeObjectURL(imgUrl);
    };
  }, [dailyMoment, imgUrl]);

  return (
    <Link
      href={`${treeId}/daily/${dailyMoment.id}`}
      className="group flex flex-col bg-surface-a0 border border-surface-a10 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="relative w-full aspect-[4/3] bg-surface-a10 overflow-hidden">
        {imgUrl ? (
          // Dùng thẻ img chuẩn kết hợp object-cover để hiển thị Blob URL tối ưu nhất
          <img
            src={imgUrl}
            alt={dailyMoment.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-surface-a30" />
          </div>
        )}
      </div>
      <div className="p-3 bg-surface-a0">
        <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {dailyMoment.title || "Khoảnh khắc không tên"}
        </h3>
        {/* Tuỳ chọn: Có thể thêm thời gian tạo ảnh ở đây nếu database có lưu */}
      </div>
    </Link>
  );
};
