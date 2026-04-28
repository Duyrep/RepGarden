"use client";

import {
  Activity,
  AlertCircle,
  FileEdit,
  Hash,
  HelpCircle,
  Palette,
  Ruler,
  Save,
  Type,
  X,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Header } from "@/components/layout";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  Input,
  Loading,
} from "@/components/ui";
import {
  MetricCardColor,
  MetricCardIconMap,
  MetricCardIcons,
  MetricValueType,
} from "@/components/ui/MetricCard";
import { appDB, type Metric } from "@/db";
import { cn } from "@/utils";

export default function EditMetric() {
  const metricId = Number(useParams().metricId);
  const treeId = Number(useParams().treeId);
  const projectId = Number(useParams().projectId);
  const router = useRouter();

  const [metric, setMetric] = useState<Metric | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen1, setIsOpen1] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tải dữ liệu chỉ số cần sửa 1 lần duy nhất khi vào trang
  useEffect(() => {
    const loadMetric = async () => {
      if (Number.isNaN(metricId)) {
        setIsLoading(false);
        return;
      }
      try {
        const data = await appDB.metrics.get(metricId);
        if (data) {
          setMetric(data);
        }
      } catch (error) {
        console.error("Lỗi khi tải chỉ số:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMetric();
  }, [metricId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !metric ||
      !metric.name.trim() ||
      !metric.value.toString().trim() ||
      isSubmitting
    )
      return;

    setIsSubmitting(true);
    try {
      // Cập nhật vào cơ sở dữ liệu
      await appDB.metrics.update(metricId, {
        name: metric.name,
        value: metric.value,
        valueType: metric.valueType,
        iconName: metric.iconName,
        color: metric.color,
        // Không cập nhật createdAt để giữ nguyên ngày tạo gốc
      });

      // Quay lại trang danh sách chỉ số (Back)
      router.back();
    } catch (error) {
      console.error("Lỗi khi cập nhật chỉ số:", error);
      setIsSubmitting(false);
    }
  };

  // Helper để lấy nhãn hiển thị cho từng loại đơn vị
  const getUnitLabel = (type: string) => {
    switch (type) {
      case "temperature":
        return "℃ (Nhiệt độ)";
      case "percentage":
        return "% (Phần trăm)";
      case "days":
        return "Ngày";
      case "hours":
        return "Giờ";
      case "currency":
        return "VNĐ (Tiền tệ)";
      case "bytes":
        return "KB / MB";
      case "distance":
        return "km / m";
      case "weight":
        return "kg / g";
      case "count":
        return "Số đếm (1, 2...)";
      case "raw":
        return "Không (Raw)";
      default:
        return type;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <Loading />
        <p className="text-surface-a40 font-medium animate-pulse">
          Đang tải dữ liệu chỉ số...
        </p>
      </div>
    );
  }

  if (!metric) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground animate-fade-in p-4 text-center">
        <div className="w-24 h-24 bg-danger-a0/10 text-danger-a0 flex items-center justify-center rounded-full mb-6">
          <AlertCircle className="w-12 h-12" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Không tìm thấy chỉ số
        </h2>
        <p className="text-surface-a50 mb-8 max-w-md">
          Chỉ số bạn muốn chỉnh sửa không tồn tại hoặc đã bị xóa.
        </p>
        <Button
          onClick={() => router.back()}
          className="bg-primary text-on-primary hover:bg-primary-a10 px-8 py-3 rounded-full shadow-sm"
        >
          Quay lại
        </Button>
      </div>
    );
  }

  const SelectedIcon = MetricCardIconMap[metric.iconName] || HelpCircle;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col animate-fade-in overflow-x-hidden">
      <Header
        href={`/project/${projectId}/tree/${treeId}/metrics`}
        title="Chỉnh sửa chỉ số"
        variant="primary"
        className="sticky top-0 z-10 shadow-sm"
      />

      <main className="flex-1 w-full max-w-2xl mx-auto p-4 md:p-8 flex flex-col justify-center pt-[calc(var(--header-height)+1.5rem)]">
        <div className="bg-surface-a0 p-6 md:p-8 rounded-2xl shadow-sm border border-surface-a10 animate-slide-up">
          <div className="mb-6 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-surface-tonal-a0 flex items-center justify-center text-primary">
              <FileEdit className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-primary">Chỉnh sửa</h2>
              <p className="text-surface-a50 text-sm">
                Cập nhật thông tin cho chỉ số{" "}
                <strong className="text-foreground">{metric.name}</strong>
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Tên chỉ số */}
            <div className="space-y-2">
              <label
                htmlFor="metricName"
                className="flex items-center gap-2 text-sm font-medium text-foreground"
              >
                <Type className="w-4 h-4 text-primary" />
                Tên chỉ số <span className="text-danger-a0">*</span>
              </label>
              <Input
                id="metricName"
                placeholder="Vd: Nhiệt độ, Độ ẩm..."
                autoFocus
                value={metric.name}
                className="w-full"
                onChange={(e) =>
                  setMetric((prev) =>
                    prev ? { ...prev, name: e.target.value } : prev,
                  )
                }
              />
            </div>

            {/* Giá trị */}
            <div className="space-y-2">
              <label
                htmlFor="metricValue"
                className="flex items-center gap-2 text-sm font-medium text-foreground"
              >
                <Hash className="w-4 h-4 text-primary" />
                Giá trị hiện tại <span className="text-danger-a0">*</span>
              </label>
              <div className="flex gap-2">
                <Input
                  id="metricValue"
                  placeholder="Vd: 28, 80..."
                  value={metric.value}
                  className="w-full flex-1"
                  onChange={(e) =>
                    setMetric((prev) =>
                      prev ? { ...prev, value: e.target.value } : prev,
                    )
                  }
                />
              </div>
            </div>

            {/* Đơn vị / Loại giá trị */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Ruler className="w-4 h-4 text-primary" />
                Đơn vị đo lường
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.values(MetricValueType).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() =>
                      setMetric((prev) =>
                        prev ? { ...prev, valueType: type } : prev,
                      )
                    }
                    className={cn(
                      "px-3 py-2 text-sm rounded-xl border transition-all text-left truncate",
                      metric.valueType === type
                        ? "bg-primary-a10/10 border-primary text-primary font-semibold"
                        : "bg-surface-a0 border-surface-a20 text-surface-a50 hover:border-primary/50 hover:text-foreground",
                    )}
                  >
                    {getUnitLabel(type)}
                  </button>
                ))}
              </div>
            </div>

            {/* Chọn Icon và Màu sắc */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-2">
              {/* Box Icon */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Biểu tượng
                </label>
                <Dialog open={isOpen1} onOpenChange={setIsOpen1}>
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full flex items-center justify-between bg-surface-a0 border-surface-a20 hover:bg-surface-a10 h-12"
                    >
                      <span className="text-surface-a50 font-normal">
                        Đổi icon
                      </span>
                      <SelectedIcon
                        className="w-5 h-5 text-on-surface"
                        style={{ color: metric.color }}
                      />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogTitle className="text-xl font-bold mb-4">
                      Chọn biểu tượng
                    </DialogTitle>
                    <div className="grid grid-cols-5 sm:grid-cols-6 gap-3 max-h-[60vh] overflow-y-auto p-1">
                      {Object.values(MetricCardIcons).map((iconName) => {
                        const IconComponent =
                          MetricCardIconMap[iconName] || HelpCircle;
                        const isSelected = metric.iconName === iconName;
                        return (
                          <button
                            key={iconName}
                            type="button"
                            onClick={() => {
                              setMetric((prev) =>
                                prev ? { ...prev, iconName } : prev,
                              );
                              setIsOpen1(false);
                            }}
                            className={cn(
                              "aspect-square flex items-center justify-center rounded-xl transition-all",
                              isSelected
                                ? "bg-primary text-on-primary shadow-md transform scale-105"
                                : "bg-surface-a10 text-surface-a50 hover:bg-surface-a20 hover:text-foreground",
                            )}
                          >
                            <IconComponent className="w-6 h-6" />
                          </button>
                        );
                      })}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Box Màu sắc */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Màu sắc hiển thị
                </label>
                <Dialog open={isOpen2} onOpenChange={setIsOpen2}>
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full flex items-center justify-between bg-surface-a0 border-surface-a20 hover:bg-surface-a10 h-12"
                    >
                      <span className="text-surface-a50 font-normal flex items-center gap-2">
                        <Palette className="w-4 h-4" /> Đổi màu
                      </span>
                      <div
                        className="w-6 h-6 rounded-full shadow-sm border border-black/10"
                        style={{ backgroundColor: metric.color }}
                      />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-sm">
                    <DialogTitle className="text-xl font-bold mb-4">
                      Chọn màu sắc
                    </DialogTitle>
                    <div className="grid grid-cols-5 gap-4 p-2 justify-items-center">
                      {Object.values(MetricCardColor).map((color) => {
                        const isSelected = metric.color === color;
                        return (
                          <button
                            key={color}
                            type="button"
                            onClick={() => {
                              setMetric((prev) =>
                                prev ? { ...prev, color } : prev,
                              );
                              setIsOpen2(false);
                            }}
                            style={{ backgroundColor: color }}
                            className={cn(
                              "w-10 h-10 rounded-full transition-transform shadow-sm",
                              isSelected
                                ? "ring-2 ring-offset-2 ring-primary scale-110"
                                : "hover:scale-110 border border-black/10",
                            )}
                            aria-label={`Chọn màu ${color}`}
                          />
                        );
                      })}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Nút hành động */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6 pt-6 border-t border-surface-a10">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="w-full sm:w-auto bg-surface-a0 text-foreground border-surface-a20 hover:bg-surface-a10"
              >
                <X className="w-4 h-4 mr-2" /> Hủy
              </Button>
              <Button
                type="submit"
                disabled={
                  !metric.name.trim() ||
                  !metric.value.toString().trim() ||
                  isSubmitting
                }
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-on-primary hover:bg-primary-a10 shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="animate-pulse">Đang lưu...</span>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Lưu thay đổi
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
