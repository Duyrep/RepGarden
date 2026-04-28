/** biome-ignore-all lint/a11y/noLabelWithoutControl: <explanation> */
"use client";

import { useLiveQuery } from "dexie-react-hooks";
import {
  Activity,
  Hash,
  HelpCircle,
  ListPlus,
  Palette,
  PlusCircle,
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

export default function AddDailyMetric() {
  const dailyId = Number(useParams().dailyId);
  const treeId = Number(useParams().treeId);
  const router = useRouter();

  // Chế độ form: Nhập cho chỉ số đã có sẵn hay Tạo mới hoàn toàn
  const [mode, setMode] = useState<"existing" | "new">("existing");
  const [selectedMetricId, setSelectedMetricId] = useState<number | "">("");

  const defaultMetric: Metric = {
    treeId,
    name: "",
    iconName: MetricCardIcons.activity,
    value: "",
    valueType: MetricValueType.temperature,
    color: MetricCardColor.red,
    createdAt: new Date().toISOString(),
  };

  const [metric, setMetric] = useState<Metric>(defaultMetric);
  const [isOpen1, setIsOpen1] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lấy dữ liệu nhật ký và danh sách chỉ số gốc của cây
  const dailyMoment = useLiveQuery(
    () => appDB.dailyMoments.get(dailyId),
    [dailyId],
  );
  const existingMetrics = useLiveQuery(
    () => appDB.metrics.where("treeId").equals(treeId).toArray(),
    [treeId],
  );

  // Tự động chuyển sang chế độ "Tạo mới" nếu cây chưa có chỉ số nào
  useEffect(() => {
    if (existingMetrics && existingMetrics.length === 0) {
      setMode("new");
    }
  }, [existingMetrics]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!metric.value.toString().trim() || isSubmitting) return;
    if (mode === "new" && !metric.name.trim()) return;
    if (mode === "existing" && selectedMetricId === "") return;

    setIsSubmitting(true);
    try {
      let finalMetricId: number;

      if (mode === "new") {
        // 1. Lưu chỉ số mới vào bảng metrics gốc
        finalMetricId = await appDB.metrics.add({
          treeId,
          name: metric.name.trim(),
          value: metric.value, // Giá trị mới nhất
          valueType: metric.valueType,
          iconName: metric.iconName,
          color: metric.color,
          createdAt: new Date().toISOString(),
        });
      } else {
        // 2. Sử dụng ID của chỉ số đã chọn
        finalMetricId = Number(selectedMetricId);
        // Cập nhật giá trị mới nhất cho bảng gốc (Tùy chọn, để thẻ gốc luôn hiện số mới nhất)
        await appDB.metrics.update(finalMetricId, { value: metric.value });
      }

      // 3. Liên kết { metricId, value } vào nhật ký hôm nay
      if (dailyMoment) {
        const currentMetricsList = dailyMoment.metrics || [];

        // Kiểm tra xem chỉ số này hôm nay đã được đo chưa, nếu rồi thì ghi đè, chưa thì thêm mới
        const existingRecordIndex = currentMetricsList.findIndex(
          (m) => m.metricId === finalMetricId,
        );
        if (existingRecordIndex >= 0) {
          currentMetricsList[existingRecordIndex].value = metric.value;
        } else {
          currentMetricsList.push({
            metricId: finalMetricId,
            value: metric.value,
          });
        }

        // Dùng lệnh update của Dexie để lưu xuống Database thực sự
        await appDB.dailyMoments.update(dailyId, {
          metrics: currentMetricsList,
        });
      }

      // 4. Quay lại trang chi tiết nhật ký
      router.back();
    } catch (error) {
      console.error("Lỗi khi lưu chỉ số vào nhật ký:", error);
      setIsSubmitting(false);
    }
  };

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

  const SelectedIcon = MetricCardIconMap[metric.iconName] || HelpCircle;

  if (dailyMoment === undefined || existingMetrics === undefined)
    return <Loading />;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col animate-fade-in overflow-x-hidden">
      <Header
        href="../"
        title="Thêm chỉ số đo"
        variant="primary"
        className="sticky top-0 z-10 shadow-sm"
      />

      <main className="flex-1 w-full max-w-2xl mx-auto p-4 md:p-8 flex flex-col justify-center pt-[calc(var(--header-height)+1.5rem)]">
        <div className="bg-surface-a0 p-6 md:p-8 rounded-2xl shadow-sm border border-surface-a10 animate-slide-up">
          <div className="mb-6 flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
              <Activity className="w-6 h-6" /> Thêm chỉ số cho ngày
            </h2>

            {/* Tabs Chuyển đổi chế độ */}
            {existingMetrics.length > 0 && (
              <div className="flex gap-2 p-1 bg-surface-a10 rounded-xl">
                <button
                  type="button"
                  onClick={() => setMode("existing")}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all",
                    mode === "existing"
                      ? "bg-surface-a0 text-primary shadow-sm"
                      : "text-surface-a50 hover:text-foreground",
                  )}
                >
                  <ListPlus className="w-4 h-4" /> Đã có sẵn
                </button>
                <button
                  type="button"
                  onClick={() => setMode("new")}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all",
                    mode === "new"
                      ? "bg-surface-a0 text-primary shadow-sm"
                      : "text-surface-a50 hover:text-foreground",
                  )}
                >
                  <PlusCircle className="w-4 h-4" /> Tạo mới
                </button>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* =========================================
                CHẾ ĐỘ: CHỌN CHỈ SỐ ĐÃ CÓ
                ========================================= */}
            {mode === "existing" && (
              <div className="space-y-2 animate-fade-in">
                <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Activity className="w-4 h-4 text-primary" /> Chọn chỉ số{" "}
                  <span className="text-danger-a0">*</span>
                </label>
                <select
                  value={selectedMetricId}
                  onChange={(e) => setSelectedMetricId(Number(e.target.value))}
                  className="w-full h-12 px-4 rounded-xl border border-surface-a20 bg-surface-a0 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all appearance-none"
                  required
                >
                  <option value="" disabled>
                    -- Chọn một chỉ số để cập nhật --
                  </option>
                  {existingMetrics.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* =========================================
                CHẾ ĐỘ: TẠO CHỈ SỐ MỚI
                ========================================= */}
            {mode === "new" && (
              <>
                <div className="space-y-2 animate-fade-in">
                  <label
                    htmlFor="metricName"
                    className="flex items-center gap-2 text-sm font-medium text-foreground"
                  >
                    <Type className="w-4 h-4 text-primary" /> Tên chỉ số{" "}
                    <span className="text-danger-a0">*</span>
                  </label>
                  <Input
                    id="metricName"
                    placeholder="Vd: Nhiệt độ, Số lượng lá..."
                    autoFocus
                    value={metric.name}
                    className="w-full"
                    onChange={(e) =>
                      setMetric((prev) => ({ ...prev, name: e.target.value }))
                    }
                  />
                </div>

                <div className="space-y-3 animate-fade-in">
                  <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Ruler className="w-4 h-4 text-primary" /> Đơn vị đo lường
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {Object.values(MetricValueType).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() =>
                          setMetric((prev) => ({ ...prev, valueType: type }))
                        }
                        className={cn(
                          "px-3 py-2 text-sm rounded-xl border transition-all text-left truncate",
                          metric.valueType === type
                            ? "bg-primary-a10/10 border-primary text-primary font-semibold"
                            : "bg-surface-a0 border-surface-a20 text-surface-a50",
                        )}
                      >
                        {getUnitLabel(type)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-2 animate-fade-in">
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
                          className="w-full flex items-center justify-between bg-surface-a0 border-surface-a20 h-12"
                        >
                          <span className="text-surface-a50 font-normal">
                            Chọn icon
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
                                  setMetric((prev) => ({ ...prev, iconName }));
                                  setIsOpen1(false);
                                }}
                                className={cn(
                                  "aspect-square flex items-center justify-center rounded-xl transition-all",
                                  isSelected
                                    ? "bg-primary text-on-primary shadow-md transform scale-105"
                                    : "bg-surface-a10 text-surface-a50",
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
                          className="w-full flex items-center justify-between bg-surface-a0 border-surface-a20 h-12"
                        >
                          <span className="text-surface-a50 font-normal flex items-center gap-2">
                            <Palette className="w-4 h-4" /> Bảng màu
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
                                  setMetric((prev) => ({ ...prev, color }));
                                  setIsOpen2(false);
                                }}
                                style={{ backgroundColor: color }}
                                className={cn(
                                  "w-10 h-10 rounded-full transition-transform shadow-sm",
                                  isSelected
                                    ? "ring-2 ring-offset-2 ring-primary scale-110"
                                    : "hover:scale-110",
                                )}
                              />
                            );
                          })}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </>
            )}

            {/* CẢ 2 CHẾ ĐỘ ĐỀU CẦN NHẬP GIÁ TRỊ (VALUE) */}
            <div className="space-y-2 mt-2 pt-4 border-t border-surface-a10">
              <label
                htmlFor="metricValue"
                className="flex items-center gap-2 text-sm font-medium text-foreground"
              >
                <Hash className="w-4 h-4 text-primary" />
                Giá trị đo được trong ngày{" "}
                <span className="text-danger-a0">*</span>
              </label>
              <Input
                id="metricValue"
                placeholder="Nhập giá trị (Vd: 28, 80...)"
                value={metric.value}
                className="w-full bg-surface-tonal-a0/30 text-lg font-bold"
                onChange={(e) =>
                  setMetric((prev) => ({ ...prev, value: e.target.value }))
                }
                required
              />
            </div>

            {/* Nút hành động */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-4 pt-4 border-t border-surface-a10">
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
                  !metric.value.toString().trim() ||
                  isSubmitting ||
                  (mode === "existing" && selectedMetricId === "") ||
                  (mode === "new" && !metric.name.trim())
                }
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-on-primary hover:bg-primary-a10 shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="animate-pulse">Đang lưu...</span>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Lưu vào nhật ký
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
