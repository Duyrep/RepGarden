"use client";

import {
  Calendar,
  Captions,
  CheckCircle2,
  ImagePlus,
  UploadCloud,
  X,
} from "lucide-react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Header } from "@/components/layout";
import { Button, Input } from "@/components/ui";
import { appDB } from "@/db";

type PreviewImage = {
  id: string;
  url: string;
  name: string;
  file: File;
};

// Lưu ý: Tên Component trong React luôn nên bắt đầu bằng chữ viết hoa
export default function AddDailyMoment() {
  const treeId = Number(useParams().treeId);
  const pathname = usePathname();
  const router = useRouter();

  const imageFileInput = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [datetime, setDatetime] = useState("");
  const [previews, setPreviews] = useState<PreviewImage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tự động set thời gian mặc định là hiện tại
  useEffect(() => {
    const now = new Date();
    // Điều chỉnh timezone offset để tương thích với input datetime-local
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setDatetime(now.toISOString().slice(0, 16));
  }, []);

  // Dọn dẹp URL Blob khi component unmount để tránh rò rỉ bộ nhớ
  useEffect(() => {
    return () => {
      previews.map((p) => URL.revokeObjectURL(p.url));
    };
  }, [previews]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newPreviews: PreviewImage[] = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      url: URL.createObjectURL(file),
      name: file.name,
      file,
    }));

    setPreviews((prev) => [...prev, ...newPreviews]);

    if (imageFileInput.current) {
      imageFileInput.current.value = "";
    }
  };

  const handleRemoveImage = (indexToRemove: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviews((prev) => {
      const newPreviews = [...prev];
      // Xóa URL blob khỏi bộ nhớ trước khi xóa khỏi state
      URL.revokeObjectURL(newPreviews[indexToRemove].url);
      newPreviews.splice(indexToRemove, 1);
      return newPreviews;
    });
  };

  const handleAdd = async () => {
    if (previews.length === 0 || !title.trim()) return;
    setIsSubmitting(true);

    try {
      await appDB.dailyMoments.add({
        treeId,
        title: title.trim(),
        images: previews.map((preview) => preview.id),
        datetime,
        createdAt: new Date().toISOString(),
      });

      // Lưu song song tất cả các ảnh vào bảng images
      await Promise.all(
        previews.map((preview) =>
          appDB.images.add({
            id: preview.id,
            file: preview.file,
            createdAt: new Date().toISOString(),
          }),
        ),
      );

      router.push(pathname.split("/").slice(0, -2).join("/") || "/");
    } catch (error) {
      console.error("Lỗi khi lưu nhật ký:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col animate-fade-in overflow-x-hidden">
      <Header
        title="Thêm nhật ký ảnh"
        href="../"
        variant="primary"
        className="sticky top-0 z-10 shadow-sm"
      />

      <main className="flex-1 w-full max-w-2xl mx-auto p-4 md:p-8 flex flex-col gap-6 pt-[calc(var(--header-height)+1.5rem)]">
        {/* Khu vực Upload Ảnh */}
        <div className="bg-surface-a0 p-4 md:p-6 rounded-2xl shadow-sm border border-surface-a10 animate-slide-up">
          <input
            ref={imageFileInput}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />

          {previews.length === 0 ? (
            <button
              type="button"
              onClick={() => imageFileInput.current?.click()}
              className="w-full flex flex-col items-center justify-center p-12 border-2 border-dashed border-surface-a20 rounded-xl bg-surface-tonal-a0/50 hover:bg-surface-tonal-a0 hover:border-primary hover:text-primary transition-all duration-300 group cursor-pointer"
            >
              <UploadCloud className="w-12 h-12 text-surface-a40 group-hover:text-primary mb-4 transition-colors" />
              <b className="text-lg mb-1">Tải ảnh lên</b>
              <p className="text-sm text-surface-a40 font-normal">
                Nhấn để chọn một hoặc nhiều ảnh
              </p>
            </button>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-surface-a50">
                  Đã chọn {previews.length} ảnh
                </span>
                <Button
                  variant="ghost"
                  onClick={() => imageFileInput.current?.click()}
                  className="text-primary hover:bg-primary/10 h-8 px-3 text-sm flex items-center gap-2 rounded-full"
                >
                  <ImagePlus className="w-4 h-4" />
                  Thêm ảnh
                </Button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {previews.map(({ id, url, name }, index) => (
                  <div
                    key={id}
                    className="group relative aspect-square rounded-xl overflow-hidden border border-surface-a10 shadow-sm"
                  >
                    {/* Nút xóa ảnh */}
                    <button
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-danger-a0"
                      onClick={(e) => handleRemoveImage(index, e)}
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {/* Hiển thị ảnh bằng thẻ img chuẩn */}
                    <img
                      src={url}
                      alt={name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Khu vực Nhập thông tin */}
        <div className="bg-surface-a0 p-4 md:p-6 rounded-2xl shadow-sm border border-surface-a10 flex flex-col gap-5 animate-slide-up [animation-delay:100ms]">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Captions className="w-4 h-4 text-primary" />
              Tiêu đề <span className="text-danger-a0">*</span>
            </label>
            <Input
              className="w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Cây ra lá mới, Ngày thứ 5..."
              autoFocus={previews.length > 0}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Ngày giờ chụp
            </label>
            <Input
              type="datetime-local"
              className="w-full"
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
            />
          </div>
        </div>

        {/* Thanh Hành động */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 animate-slide-up [animation-delay:200ms]">
          <Link href="../" className="w-full sm:w-auto">
            <Button
              variant="outline"
              className="w-full bg-surface-a0 hover:bg-surface-a10 text-foreground border-surface-a20"
            >
              Hủy
            </Button>
          </Link>
          <Button
            onClick={handleAdd}
            disabled={previews.length === 0 || !title.trim() || isSubmitting}
            className="w-full sm:flex-1 bg-primary text-on-primary hover:bg-primary-a10 flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="animate-pulse">Đang lưu...</span>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                Lưu nhật ký
              </>
            )}
          </Button>
        </div>
      </main>
    </div>
  );
}
