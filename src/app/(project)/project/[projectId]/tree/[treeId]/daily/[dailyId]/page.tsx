/** biome-ignore-all lint/a11y/noLabelWithoutControl: <explanation> */
/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <explanation> */
"use client";

import { useLiveQuery } from "dexie-react-hooks";
import {
  Activity,
  AlertCircle,
  CalendarDays,
  Edit,
  Image as ImageIcon,
  ImagePlus,
  Leaf,
  Notebook,
  PenLine,
  Plus,
  Save,
  Settings2,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Header } from "@/components/layout";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  Input,
  Loading,
  Textarea,
} from "@/components/ui";
import { MetricCardIconMap } from "@/components/ui/MetricCard";
import { appDB } from "@/db";

export default function Daily() {
  const dailyId = Number(useParams().dailyId);
  const treeId = Number(useParams().treeId);
  const projectId = Number(useParams().projectId);

  // Dùng pathname để tạo đường dẫn điều hướng tuyệt đối cho an toàn
  const pathname = usePathname();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lấy dữ liệu Nhật ký, Cây, và toàn bộ Chỉ số gốc của cây đó
  const dailyMoment = useLiveQuery(
    () => appDB.dailyMoments.get(dailyId),
    [dailyId],
  );
  const tree = useLiveQuery(() => appDB.trees.get(treeId), [treeId]);
  const treeMetrics = useLiveQuery(
    () => appDB.metrics.where("treeId").equals(treeId).toArray(),
    [treeId],
  );

  // States cho Dialog thông tin chung
  const [isEditingInfo, setIsEditingInfo] = useState(false);

  // ==========================================
  // HÀM XỬ LÝ: Thông tin chung (Tiêu đề, Ngày, Ghi chú)
  // ==========================================
  const handleSaveInfo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await appDB.dailyMoments.update(dailyId, {
      title: formData.get("title") as string,
      datetime: formData.get("datetime") as string,
      note: formData.get("note") as string,
    });
    setIsEditingInfo(false);
  };

  // ==========================================
  // HÀM XỬ LÝ: Hình ảnh
  // ==========================================
  const handleAddImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !dailyMoment) return;

    // Lưu từng ảnh vào bảng images
    const newImages = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      file,
      createdAt: new Date().toISOString(),
    }));
    await appDB.images.bulkAdd(newImages);

    // Cập nhật mảng ID ảnh vào nhật ký
    const updatedImageIds = [
      ...(dailyMoment.images || []),
      ...newImages.map((i) => i.id),
    ];
    await appDB.dailyMoments.update(dailyId, { images: updatedImageIds });

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveImage = async (imageIdToRemove: string) => {
    if (!dailyMoment || !confirm("Bạn có chắc muốn xóa ảnh này khỏi nhật ký?"))
      return;
    const updatedImages = dailyMoment.images.filter(
      (id) => id !== imageIdToRemove,
    );
    await appDB.dailyMoments.update(dailyId, { images: updatedImages });
    // Tùy chọn: Xóa hẳn khỏi DB ảnh để giải phóng dung lượng
    await appDB.images.delete(imageIdToRemove);
  };

  // ==========================================
  // HÀM XỬ LÝ: Chỉ số (Xóa khỏi ngày hôm nay)
  // ==========================================
  const handleDeleteMetric = async (index: number) => {
    if (
      !dailyMoment ||
      !dailyMoment.metrics ||
      !confirm("Xóa chỉ số này khỏi ngày hôm nay?")
    )
      return;
    const newMetrics = [...dailyMoment.metrics];
    newMetrics.splice(index, 1);
    await appDB.dailyMoments.update(dailyId, { metrics: newMetrics });
  };

  // ==========================================
  // RENDER TRẠNG THÁI
  // ==========================================
  if (
    dailyMoment === undefined ||
    tree === undefined ||
    treeMetrics === undefined
  )
    return <Loading />;

  if (!dailyMoment) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-background">
        <CalendarDays className="w-16 h-16 text-surface-a40 mb-4" />
        <h2 className="text-2xl font-bold mb-2 text-foreground">
          Không tìm thấy nhật ký
        </h2>
        <Link href={`/project/${projectId}/tree/${treeId}`}>
          <Button className="bg-primary text-on-primary">Quay lại cây</Button>
        </Link>
      </div>
    );
  }

  const momentDate = new Date(dailyMoment.datetime);
  const formattedDate = new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(momentDate);

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 overflow-x-hidden">
      <Header
        title="Nhật ký chi tiết"
        href={`/project/${projectId}/tree/${treeId}`}
        variant="primary"
        className="sticky top-0 z-10 shadow-sm"
      />

      <main className="max-w-5xl mx-auto p-4 md:p-8 flex flex-col gap-8 animate-fade-in pt-[calc(var(--header-height)+1.5rem)]">
        {/* Banner chính & Sửa thông tin */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary to-primary-to-mint rounded-3xl p-6 md:p-8 text-on-primary shadow-md">
          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-lg text-sm font-medium">
                <Leaf className="w-4 h-4" /> {tree?.name}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold">
                {dailyMoment.title}
              </h1>
              <div className="flex items-center gap-2 text-white/90">
                <CalendarDays className="w-5 h-5" /> {formattedDate}
              </div>
            </div>

            {/* Dialog Sửa Thông Tin Chung */}
            <Dialog open={isEditingInfo} onOpenChange={setIsEditingInfo}>
              <DialogTrigger asChild>
                <Button className="bg-white/20 hover:bg-white/30 text-white border-0 shadow-none">
                  <Edit className="w-4 h-4 mr-2" /> Sửa thông tin
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogTitle className="text-xl font-bold text-primary">
                  Sửa thông tin nhật ký
                </DialogTitle>
                <form
                  onSubmit={handleSaveInfo}
                  className="flex flex-col gap-4 mt-4"
                >
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Tiêu đề</label>
                    <Input
                      name="title"
                      defaultValue={dailyMoment.title}
                      required
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Ngày giờ</label>
                    <Input
                      type="datetime-local"
                      name="datetime"
                      defaultValue={dailyMoment.datetime.slice(0, 16)}
                      required
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">
                      Ghi chú hằng ngày
                    </label>
                    <Textarea
                      name="note"
                      defaultValue={dailyMoment.note || ""}
                      rows={4}
                      className="w-full resize-none"
                      placeholder="Hôm nay cây thế nào..."
                    />
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditingInfo(false)}
                    >
                      Hủy
                    </Button>
                    <Button
                      type="submit"
                      className="bg-primary text-on-primary"
                    >
                      <Save className="w-4 h-4 mr-2" /> Lưu
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Khu vực 1: Hình ảnh */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-primary" /> Hình ảnh (
              {dailyMoment.images?.length || 0})
            </h2>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleAddImages}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="text-primary border-primary hover:bg-primary/10"
            >
              <ImagePlus className="w-4 h-4 mr-2" /> Thêm ảnh
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
            {dailyMoment.images?.map((imageId) => (
              <DailyImage
                key={imageId}
                imageId={imageId}
                onRemove={() => handleRemoveImage(imageId)}
              />
            ))}
            {(!dailyMoment.images || dailyMoment.images.length === 0) && (
              <div className="col-span-full py-8 text-center text-surface-a40 bg-surface-a0 border border-dashed border-surface-a20 rounded-xl">
                Chưa có ảnh nào được chụp hôm nay.
              </div>
            )}
          </div>
        </section>

        {/* Khu vực 2: Chỉ số đo được (Map với DB gốc) */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" /> Chỉ số đo được
            </h2>
            {/* Điểu hướng sang trang Thêm Chỉ Số */}
            <Link href={`${pathname}/metric/add`}>
              <Button
                variant="outline"
                size="sm"
                className="text-primary border-primary hover:bg-primary/10"
              >
                <Plus className="w-4 h-4 mr-2" /> Thêm chỉ số
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dailyMoment.metrics?.map((metricRecord, index) => {
              // Tìm dữ liệu gốc của chỉ số này từ bảng metrics
              const baseMetric = treeMetrics.find(
                (m) => m.id === metricRecord.metricId,
              );

              if (!baseMetric) {
                return (
                  <div
                    key={metricRecord.metricId}
                    className="flex items-center gap-4 bg-surface-a10 border border-danger-a0/30 rounded-2xl p-4 opacity-70"
                  >
                    <AlertCircle className="w-6 h-6 text-danger-a0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-surface-a50">
                        Chỉ số không xác định
                      </p>
                      <p className="text-lg font-bold text-foreground line-through">
                        {metricRecord.value}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleDeleteMetric(index)}
                      variant="ghost"
                      className="text-danger-a0 hover:bg-danger-a0/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                );
              }

              const IconComponent =
                MetricCardIconMap[baseMetric.iconName] || Activity;
              return (
                <div
                  key={`${metricRecord.metricId}-${index}`}
                  className="group relative flex flex-col bg-surface-a0 border border-surface-a10 rounded-2xl p-4 shadow-sm hover:border-primary transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: `${baseMetric.color}20`,
                        color: baseMetric.color,
                      }}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-surface-a50 truncate">
                        {baseMetric.name}
                      </p>
                      <p className="text-xl font-bold text-foreground truncate">
                        {metricRecord.value}
                      </p>
                    </div>
                  </div>

                  {/* Nút Sửa/Xóa chỉ số (Hiện khi hover trên PC) */}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                    <Link href={`${pathname}/metric/add`}>
                      <Button className="p-1.5 h-auto bg-surface-a10 hover:bg-primary hover:text-white rounded-lg text-surface-a50 transition-colors">
                        <Settings2 className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      onClick={() => handleDeleteMetric(index)}
                      className="p-1.5 h-auto bg-surface-a10 hover:bg-danger-a0 hover:text-white rounded-lg text-danger-a0 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}

            {(!dailyMoment.metrics || dailyMoment.metrics.length === 0) && (
              <div className="col-span-full py-8 text-center text-surface-a40 bg-surface-a0 border border-dashed border-surface-a20 rounded-xl">
                Chưa có chỉ số nào được ghi nhận.
              </div>
            )}
          </div>
        </section>
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Notebook className="w-5 h-5 text-primary" />
              Ghi chú
            </h2>
            <Button
              onClick={() => setIsEditingInfo(true)}
              variant="outline"
              size="sm"
              className="text-primary border-primary hover:bg-primary/10"
            >
              <PenLine className="w-4 h-4 mr-2" />
              chỉnh sửa
            </Button>
          </div>
          <div className="bg-surface-a0 rounded-md shadow-sm p-4">
            {dailyMoment.note ?? (
              <div className="w-full text-center">Chưa có ghi chú.</div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

// ==========================================
// COMPONENT PHỤ TRỢ: Quản lý ảnh & Xóa ảnh
// ==========================================
function DailyImage({
  imageId,
  onRemove,
}: {
  imageId: string;
  onRemove: () => void;
}) {
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    let isMounted = true;
    const loadImage = async () => {
      const imageRecord = await appDB.images.get(imageId);
      if (imageRecord && isMounted)
        setUrl(URL.createObjectURL(imageRecord.file));
    };
    loadImage();
    return () => {
      isMounted = false;
      if (url) URL.revokeObjectURL(url);
    };
  }, [imageId, url]);

  if (!url)
    return (
      <div className="aspect-square bg-surface-a10 animate-pulse rounded-xl" />
    );

  return (
    <div className="group aspect-square rounded-xl overflow-hidden border border-surface-a10 shadow-sm relative">
      <img
        src={url}
        alt="Nhật ký"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <Button
        onClick={onRemove}
        className="absolute top-2 right-2 p-1.5 h-auto bg-black/50 hover:bg-danger-a0 text-white rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all"
        title="Xóa ảnh"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}
