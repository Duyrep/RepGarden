"use client";

import { HelpCircle, PaintBucket } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Header } from "@/components/layout";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  Input,
} from "@/components/ui";
import {
  MetricCardColor,
  MetricCardIconMap,
  MetricCardIcons,
  MetricValueType,
} from "@/components/ui/MetricCard";
import { type Metric, metricDB } from "@/db/metric";
import { cn } from "@/utils";

export default function AddMetric() {
  const treeId = Number(useParams().treeId);
  const defaultMetric: Metric = {
    treeId,
    name: "Nhiệt độ",
    iconName: MetricCardIcons.thermometer,
    value: "28",
    valueType: MetricValueType.temperature,
    color: MetricCardColor.red,
    createdAt: new Date().toISOString(),
  };

  const pathname = usePathname();
  const router = useRouter();

  const [metric, setMetric] = useState<Metric>(defaultMetric);
  const [isOpen1, setIsOpen1] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await metricDB.metrics.add(metric);
      setMetric(defaultMetric);
      router.push(pathname.split("/").slice(0, -1).join("/") || "/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Header href="./" title="Thêm chỉ số" />
      <form
        onSubmit={handleSubmit}
        className="flex flex-col pt-[calc(var(--header-height)+1rem)] p-4"
      >
        <div className="grid grid-cols-[max-content_1fr] gap-y-2 text-right">
          <label htmlFor="metricName">Tên:&nbsp;</label>
          <Input
            id="metricName"
            placeholder="Vd: Nhiệt độ"
            autoFocus
            onChange={(e) =>
              setMetric((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <label htmlFor="metricValue">Giá trị:&nbsp;</label>
          <div className="flex gap-2 items-center">
            <Input
              id="metricValue"
              placeholder="Vd: 28"
              autoFocus
              className="w-full"
              onChange={(e) =>
                setMetric((prev) => ({ ...prev, value: e.target.value }))
              }
            />
            <p>
              {formatValue("", metric.valueType)}
              &nbsp;&nbsp;
            </p>
          </div>
          <p>Đơn vị:&nbsp;</p>
          <div className="flex flex-wrap gap-4">
            {Object.values(MetricValueType).map((type, i) => (
              <div key={type} className="flex cursor-pointer">
                <Input
                  type="radio"
                  id={`type-${type}`}
                  name="choice"
                  value={type}
                  className="cursor-pointer"
                  defaultChecked={i === 0}
                  onClick={() =>
                    setMetric((prev) => ({ ...prev, valueType: type }))
                  }
                />
                <label htmlFor={`type-${type}`} className="cursor-pointer pl-2">
                  {formatValue("", type)}
                </label>
              </div>
            ))}
          </div>
          <p className="flex justify-end items-center">Icon:&nbsp;</p>
          <div className="flex flex-wrap gap-2">
            <Dialog open={isOpen1} onOpenChange={setIsOpen1}>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="text-on-surface"
                >
                  {(() => {
                    const IconComponent =
                      MetricCardIconMap[metric.iconName] || HelpCircle;
                    return <IconComponent />;
                  })()}
                </Button>
              </DialogTrigger>
              <DialogContent aria-describedby={undefined}>
                <DialogTitle>Chọn icon</DialogTitle>
                <div className="flex flex-wrap gap-1 justify-center overflow-auto">
                  {Object.values(MetricCardIcons).map((iconName) => {
                    const IconComponent =
                      MetricCardIconMap[iconName] || HelpCircle;
                    return (
                      <Button
                        key={iconName}
                        type="button"
                        variant="secondary"
                        onClick={() => {
                          setIsOpen1(false);
                          setMetric((prev) => ({ ...prev, iconName }));
                        }}
                        className={cn(
                          "text-on-surface",
                          metric.iconName === iconName &&
                            "bg-primary hover:bg-primary",
                        )}
                      >
                        <IconComponent />
                      </Button>
                    );
                  })}
                </div>
                <DialogClose />
              </DialogContent>
            </Dialog>
            <Dialog open={isOpen2} onOpenChange={setIsOpen2}>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  style={{
                    color: metric.color,
                    borderColor: metric.color,
                  }}
                  className="bg-surface-a50"
                >
                  <PaintBucket />
                </Button>
              </DialogTrigger>
              <DialogContent aria-describedby={undefined}>
                <DialogTitle>Chọn icon</DialogTitle>
                <div className="flex flex-wrap gap-1 justify-center overflow-auto">
                  {Object.values(MetricCardColor).map((color) => {
                    return (
                      <Button
                        key={color}
                        type="button"
                        variant="secondary"
                        onClick={() => {
                          setIsOpen2(false);
                          setMetric((prev) => ({ ...prev, color }));
                        }}
                        style={{
                          color,
                        }}
                        className="bg-surface-a50"
                      >
                        <PaintBucket />
                      </Button>
                    );
                  })}
                </div>
                <DialogClose />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Link href="./">
            <Button type="button" variant="outline">
              Hủy
            </Button>
          </Link>
          <Button type="submit">Thêm</Button>
        </div>
      </form>
    </div>
  );
}

const formatValue = (val: string | number, type: string) => {
  const num = typeof val === "string" ? parseFloat(val) : val;

  switch (type) {
    case "temperature":
      return `${val}℃`;
    case "percentage":
      return `${val}%`;
    case "days":
      return `${val} ngày`;
    case "hours":
      return `${val} giờ`;
    case "currency":
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(num);
    case "bytes":
      return `${(num / 1024).toFixed(2)} KB`;
    case "distance":
      return `${val} km`;
    case "weight":
      return `${val} kg`;
    case "count":
      return new Intl.NumberFormat("vi-VN").format(num);
    case "raw":
      return "Không";
    default:
      return val;
  }
};
